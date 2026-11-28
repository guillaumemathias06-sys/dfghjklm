import "server-only";
import { z } from "zod";

/**
 * API tierce Playtomic (lecture seule) : jeton OAuth à partir du Client ID
 * et du secret, puis /api/v1/bookings filtré par club (tenant_id).
 * Identifiants lus dans les variables d'environnement Vercel, jamais en base.
 */
const BASE_URL = "https://thirdparty.playtomic.io";
const BACKOFF_MS = [1000, 2000, 4000, 8000, 16000];

export function playtomicConfig() {
  const clientId = process.env.PLAYTOMIC_CLIENT_ID;
  const secret = process.env.PLAYTOMIC_CLIENT_SECRET;
  const tenantId = process.env.PLAYTOMIC_TENANT_ID;
  if (!clientId || !secret || !tenantId) return null;
  return { clientId, secret, tenantId };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(clientId: string, secret: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - Date.now() > 5 * 60_000) return cachedToken.token;
  const res = await fetch(`${BASE_URL}/api/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, secret }),
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status === 401 || res.status === 403) throw new Error("Identifiants Playtomic refusés : vérifiez PLAYTOMIC_CLIENT_ID et PLAYTOMIC_CLIENT_SECRET.");
  if (!res.ok) throw new Error(`Playtomic a répondu ${res.status} lors de l'authentification.`);
  const json = (await res.json().catch(() => null)) as { token?: unknown; expires_in?: unknown } | null;
  if (!json || typeof json.token !== "string" || typeof json.expires_in !== "number") throw new Error("Réponse d'authentification Playtomic inattendue.");
  cachedToken = { token: json.token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.token;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function request(path: string, params: Record<string, string>): Promise<unknown> {
  const cfg = playtomicConfig();
  if (!cfg) throw new Error("Playtomic n'est pas configuré.");
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const last = BACKOFF_MS.length;
  for (let attempt = 0; attempt <= last; attempt++) {
    const token = await getToken(cfg.clientId, cfg.secret);
    let res: Response;
    try {
      res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15_000) });
    } catch (e) {
      if (attempt === last) throw new Error(`Playtomic injoignable : ${e instanceof Error ? e.message : "erreur réseau"}.`);
      await sleep(BACKOFF_MS[attempt] + Math.floor(Math.random() * 250));
      continue;
    }
    if (res.ok) return await res.json();
    // Jeton expiré entre-temps : on en redemande un, une seule fois.
    if (res.status === 401 && attempt === 0) {
      cachedToken = null;
      continue;
    }
    const transient = res.status === 429 || res.status >= 500;
    if (!transient || attempt === last) throw new Error(`Playtomic a répondu ${res.status} sur ${path}.`);
    await sleep(BACKOFF_MS[attempt] + Math.floor(Math.random() * 250));
  }
  throw new Error("Playtomic indisponible.");
}

// Les champs facultatifs arrivent en `null` explicite : `.nullish()` partout.
const bookingSchema = z
  .object({
    booking_id: z.string(),
    resource_id: z.string().nullish(),
    resource_name: z.string().nullish(),
    sport_id: z.string().nullish(),
    booking_start_date: z.string().nullish(),
    booking_end_date: z.string().nullish(),
    origin: z.string().nullish(),
    price: z.string().nullish(),
    booking_type: z.string().nullish(),
    payment_status: z.string().nullish(),
    is_canceled: z.boolean().nullish(),
    status: z.string().nullish(),
    activity_name: z.string().nullish(),
    course_name: z.string().nullish(),
  })
  .passthrough();
export type PlaytomicBooking = z.infer<typeof bookingSchema>;

/** Toutes les réservations entre deux dates (format AAAA-MM-JJTHH:MM:SS, UTC). */
export async function fetchBookings(start: string, end: string): Promise<{ bookings: PlaytomicBooking[]; skipped: number; firstIssue?: string }> {
  const cfg = playtomicConfig()!;
  const size = 100;
  const bookings: PlaytomicBooking[] = [];
  let skipped = 0;
  let firstIssue: string | undefined;
  for (let page = 0; page < 200; page++) {
    const raw = await request("/api/v1/bookings", {
      tenant_id: cfg.tenantId,
      start_booking_date: start,
      end_booking_date: end,
      page: String(page),
      size: String(size),
    });
    const list = Array.isArray(raw) ? raw : [];
    for (const entry of list) {
      const r = bookingSchema.safeParse(entry);
      if (r.success) bookings.push(r.data);
      else {
        skipped++;
        if (!firstIssue) firstIssue = r.error.issues.map((i) => `${i.path.join(".") || "(racine)"} : ${i.message}`).join(" ; ");
      }
    }
    if (list.length < size) break;
  }
  return { bookings, skipped, firstIssue };
}

/** « 25.00 EUR » → { amount: 25, currency: "EUR" } ; tout autre format → null, jamais 0. */
export function parseMoney(raw: string | null | undefined): { amount: number; currency: string } | null {
  if (!raw) return null;
  const m = /^(-?\d+(?:\.\d+)?)\s+([A-Z]{3})$/.exec(raw.trim());
  if (!m) return null;
  const amount = Number(m[1]);
  return Number.isFinite(amount) ? { amount, currency: m[2] } : null;
}

/** Les dates Playtomic sont en UTC, parfois sans suffixe « Z ». */
export function utcIso(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = /[zZ]|[+-]\d{2}:?\d{2}$/.test(raw) ? raw : `${raw}Z`;
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}
