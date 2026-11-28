import "server-only";

/**
 * Client Powens (agrégation bancaire DSP2), même API que JARVIS :
 * auth/init (une seule fois, crée l'utilisateur Powens), code temporaire pour la webview,
 * puis comptes, connexions et opérations de l'utilisateur.
 */
export function powensConfig() {
  const clientId = process.env.POWENS_CLIENT_ID;
  const clientSecret = process.env.POWENS_CLIENT_SECRET;
  const domain = process.env.POWENS_DOMAIN;
  if (!clientId || !clientSecret || !domain) return null;
  return { clientId, clientSecret, domain };
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cfg = powensConfig();
  if (!cfg) throw new Error("Powens n'est pas configuré : ajoutez POWENS_CLIENT_ID, POWENS_CLIENT_SECRET et POWENS_DOMAIN dans Vercel.");
  const res = await fetch(`https://${cfg.domain}/2.0${path}`, { ...init, signal: AbortSignal.timeout(20_000) });
  if (res.status === 401 || res.status === 403) throw new Error("Powens a refusé l'authentification.");
  if (!res.ok) throw new Error(`Powens a répondu ${res.status} sur ${path.split("?")[0]}.`);
  return (await res.json()) as T;
}
const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export async function authInit(): Promise<{ auth_token: string; id_user: number }> {
  const cfg = powensConfig()!;
  return call("/auth/init", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: cfg.clientId, client_secret: cfg.clientSecret }) });
}
export async function tempCode(token: string): Promise<string> {
  return (await call<{ code: string }>("/auth/token/code", auth(token))).code;
}

export interface PowensAccount {
  id: number;
  id_connection: number | null;
  name: string;
  original_name?: string | null;
  iban: string | null;
  balance: number | null;
  coming: number | null;
  currency: { id: string } | null;
  type: string | { name: string } | null;
  disabled?: string | null;
  deleted?: string | null;
}
export async function accounts(token: string): Promise<PowensAccount[]> {
  return (await call<{ accounts: PowensAccount[] }>("/users/me/accounts?all", auth(token))).accounts ?? [];
}
export interface PowensConnection {
  id: number;
  state: string | null;
  error_message: string | null;
  connector?: { name?: string } | null;
}
export async function connections(token: string): Promise<PowensConnection[]> {
  return (await call<{ connections: PowensConnection[] }>("/users/me/connections?expand=connector", auth(token))).connections ?? [];
}
export interface PowensTransaction {
  id: number;
  id_account: number;
  date: string;
  rdate: string | null;
  value: number | null;
  original_wording: string | null;
  simplified_wording: string | null;
  wording: string | null;
  counterparty?: { label: string | null } | null;
  coming: boolean;
  deleted: string | null;
}
/** Toutes les opérations d'un compte depuis minDate, page par page. */
export async function transactions(token: string, accountId: number, minDate: string): Promise<PowensTransaction[]> {
  const out: PowensTransaction[] = [];
  const limit = 1000;
  for (let offset = 0; offset < 50_000; offset += limit) {
    const page = (await call<{ transactions: PowensTransaction[] }>(`/users/me/accounts/${accountId}/transactions?limit=${limit}&offset=${offset}&min_date=${minDate}`, auth(token))).transactions ?? [];
    out.push(...page);
    if (page.length < limit) break;
  }
  return out;
}
