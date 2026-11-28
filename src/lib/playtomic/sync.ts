import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchBookings, parseMoney, playtomicConfig, utcIso } from "./api";

// L'API garde environ 3 mois d'historique : premier passage sur 90 jours,
// ensuite 30 jours en arrière (annulations tardives) et 60 jours à venir.
const FIRST_PAST_DAYS = 90;
const PAST_DAYS = 30;
const FUTURE_DAYS = 60;
const CHUNK = 200;

const fmt = (d: Date) => d.toISOString().slice(0, 19);

export interface SyncResult {
  status: "completed" | "partial" | "failed";
  read: number;
  skipped: number;
  error?: string;
}

export async function syncPlaytomic(triggeredBy: string): Promise<SyncResult> {
  if (!playtomicConfig()) return { status: "failed", read: 0, skipped: 0, error: "Playtomic n'est pas configuré : ajoutez PLAYTOMIC_CLIENT_ID, PLAYTOMIC_CLIENT_SECRET et PLAYTOMIC_TENANT_ID dans Vercel." };
  const db = createAdminClient();
  const { count } = await db.from("sync_runs").select("id", { count: "exact", head: true }).eq("status", "completed");
  const pastDays = (count ?? 0) === 0 ? FIRST_PAST_DAYS : PAST_DAYS;
  const now = Date.now();
  const start = new Date(now - pastDays * 86_400_000);
  const end = new Date(now + FUTURE_DAYS * 86_400_000);

  const { data: run } = await db
    .from("sync_runs")
    .insert({ source: "playtomic", status: "running", window_start: start.toISOString(), window_end: end.toISOString(), triggered_by: triggeredBy })
    .select("id")
    .single();

  let read = 0;
  let skipped = 0;
  const errors: string[] = [];
  try {
    const result = await fetchBookings(fmt(start), fmt(end));
    read = result.bookings.length;
    skipped = result.skipped;
    if (skipped) errors.push(`${skipped} réservation(s) ignorée(s) : ${result.firstIssue ?? "format inattendu"}.`);
    // Une réservation peut apparaître sur deux pages : on garde la dernière occurrence.
    const unique = [...new Map(result.bookings.map((b) => [b.booking_id, b])).values()];
    const syncedAt = new Date().toISOString();
    const rows = unique.map((b) => {
      const money = parseMoney(b.price);
      return {
        booking_id: b.booking_id,
        resource_id: b.resource_id ?? null,
        resource_name: b.resource_name ?? null,
        sport_id: b.sport_id ?? null,
        booking_type: b.booking_type ?? null,
        start_at: utcIso(b.booking_start_date),
        end_at: utcIso(b.booking_end_date),
        price_amount: money?.amount ?? null,
        price_currency: money?.currency ?? null,
        origin: b.origin ?? null,
        status: b.status ?? null,
        payment_status: b.payment_status ?? null,
        is_canceled: b.is_canceled === true || b.status === "CANCELED",
        activity_name: b.activity_name ?? null,
        course_name: b.course_name ?? null,
        synced_at: syncedAt,
      };
    });
    for (let i = 0; i < rows.length; i += CHUNK) {
      const { error } = await db.from("playtomic_bookings").upsert(rows.slice(i, i + CHUNK), { onConflict: "booking_id" });
      if (error) {
        errors.push(`Écriture en base : ${error.message}`);
        break;
      }
    }
  } catch (e) {
    errors.push(e instanceof Error ? e.message : "Erreur inconnue.");
  }

  const status: SyncResult["status"] = errors.length === 0 ? "completed" : read > 0 ? "partial" : "failed";
  if (run?.id) {
    await db
      .from("sync_runs")
      .update({ status, finished_at: new Date().toISOString(), records_read: read, records_skipped: skipped, error: errors.join(" ") || null })
      .eq("id", run.id);
  }
  return { status, read, skipped, error: errors.join(" ") || undefined };
}
