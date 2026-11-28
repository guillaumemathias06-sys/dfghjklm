import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { decrypt, encrypt } from "./crypto";
import * as powens from "./powens";

type Db = ReturnType<typeof createAdminClient>;
const FIRST_MIN_DATE = "2024-01-01"; // tout l'historique que la banque accepte de fournir (souvent 90 jours à 2 ans)
const PAST_DAYS = 45;
const CHUNK = 500;

/** Jeton Powens : créé une seule fois (auth/init), puis toujours réutilisé. */
export async function getToken(db: Db, create: boolean): Promise<string> {
  const { data } = await db.from("banque_connexion").select("jeton_chiffre").eq("id", 1).maybeSingle();
  if (data?.jeton_chiffre) {
    const t = decrypt(data.jeton_chiffre);
    if (!t) throw new Error("Impossible de déchiffrer le jeton bancaire : BANK_ENCRYPTION_KEY a-t-elle changé ?");
    return t;
  }
  if (!create) throw new Error("Aucune banque connectée.");
  if (!process.env.BANK_ENCRYPTION_KEY) throw new Error("BANK_ENCRYPTION_KEY manquante dans Vercel.");
  const init = await powens.authInit();
  const enc = encrypt(init.auth_token);
  if (!enc) throw new Error("Chiffrement du jeton bancaire impossible.");
  await db.from("banque_connexion").upsert({ id: 1, jeton_chiffre: enc, statut: "connecte", derniere_erreur: null, maj_le: new Date().toISOString() });
  return init.auth_token;
}

const wording = (t: powens.PowensTransaction) => t.wording || t.simplified_wording || t.original_wording || null;
const typeName = (a: powens.PowensAccount) => (typeof a.type === "string" ? a.type : a.type?.name ?? null);
const maskIban = (iban: string | null) => (iban ? `${iban.slice(0, 4)} •••• ${iban.slice(-4)}` : null);

export async function syncBanque(triggeredBy: string): Promise<{ status: "completed" | "partial" | "failed"; read: number; error?: string }> {
  const db = createAdminClient();
  const { data: run } = await db.from("sync_runs").insert({ source: "banque", status: "running", triggered_by: triggeredBy }).select("id").single();
  const errors: string[] = [];
  let read = 0;
  try {
    if (!powens.powensConfig()) throw new Error("Powens n'est pas configuré : ajoutez POWENS_CLIENT_ID, POWENS_CLIENT_SECRET et POWENS_DOMAIN dans Vercel.");
    const token = await getToken(db, false);
    const [accs, conns] = await Promise.all([powens.accounts(token), powens.connections(token)]);
    const connById = new Map(conns.map((c) => [c.id, c]));
    const { data: existing } = await db.from("banque_comptes").select("id, synchro_le");
    const known = new Map((existing ?? []).map((a) => [Number(a.id), a.synchro_le as string | null]));
    const now = new Date().toISOString();
    for (const a of accs) {
      if (a.deleted) continue;
      const conn = a.id_connection ? connById.get(a.id_connection) : undefined;
      const { error } = await db.from("banque_comptes").upsert(
        {
          id: a.id,
          connexion_id: a.id_connection,
          nom: a.name || a.original_name || `Compte ${a.id}`,
          banque: conn?.connector?.name ?? null,
          iban_masque: maskIban(a.iban),
          type: typeName(a),
          devise: a.currency?.id ?? "EUR",
          solde: a.balance,
          a_venir: a.coming,
          actif: !a.disabled,
          etat: conn?.state ?? null,
          synchro_le: now,
        },
        { onConflict: "id" }
      );
      if (error) {
        errors.push(`Compte ${a.name} : ${error.message}`);
        continue;
      }
      if (a.disabled) continue;
      const minDate = known.get(a.id) ? new Date(Date.now() - PAST_DAYS * 86_400_000).toISOString().slice(0, 10) : FIRST_MIN_DATE;
      const txns = await powens.transactions(token, a.id, minDate);
      // Les opérations « à venir » sont remplacées à chaque passage (la banque les réémet une fois passées).
      await db.from("banque_operations").delete().eq("compte_id", a.id).eq("a_venir", true);
      const deleted = txns.filter((t) => t.deleted).map((t) => t.id);
      if (deleted.length) await db.from("banque_operations").delete().in("id", deleted);
      const rows = txns
        .filter((t) => !t.deleted && t.value !== null)
        .map((t) => ({ id: t.id, compte_id: a.id, date_op: t.date, date_valeur: t.rdate, montant: t.value, libelle: wording(t), contrepartie: t.counterparty?.label ?? null, a_venir: !!t.coming, synchro_le: now }));
      read += rows.length;
      for (let i = 0; i < rows.length; i += CHUNK) {
        const { error: e2 } = await db.from("banque_operations").upsert(rows.slice(i, i + CHUNK), { onConflict: "id" });
        if (e2) {
          errors.push(`Opérations ${a.name} : ${e2.message}`);
          break;
        }
      }
    }
    await markInternalTransfers(db);
    const reauth = accs.some((a) => {
      const st = a.id_connection ? connById.get(a.id_connection)?.state : null;
      return st && ["SCARequired", "wrongpass", "additionalInformationNeeded", "webauthRequired", "passwordExpired", "decoupled"].includes(st);
    });
    if (reauth) errors.push("Une banque demande de renouveler le consentement (DSP2, tous les 180 jours) : cliquez sur « Connecter une banque » pour le renouveler.");
    await db.from("banque_connexion").update({ statut: errors.length ? "erreur" : "connecte", derniere_erreur: errors.join(" ") || null, maj_le: new Date().toISOString() }).eq("id", 1);
  } catch (e) {
    errors.push(e instanceof Error ? e.message : "Erreur inconnue.");
  }
  const status = errors.length === 0 ? "completed" : read > 0 ? "partial" : "failed";
  if (run?.id) await db.from("sync_runs").update({ status, finished_at: new Date().toISOString(), records_read: read, error: errors.join(" ") || null }).eq("id", run.id);
  return { status, read, error: errors.join(" ") || undefined };
}

/**
 * Virements internes : un débit et un crédit de même montant entre deux comptes du club,
 * à 3 jours d'écart au plus. Exclus des encaissements et décaissements pour ne pas compter deux fois.
 */
async function markInternalTransfers(db: Db) {
  const since = new Date(Date.now() - 800 * 86_400_000).toISOString().slice(0, 10);
  const { data } = await db.from("banque_operations").select("id, compte_id, date_op, montant, virement_interne").eq("a_venir", false).gte("date_op", since).order("id").limit(20_000);
  const ops = (data ?? []) as { id: number; compte_id: number; date_op: string; montant: number | string; virement_interne: boolean }[];
  const credits = new Map<string, typeof ops>();
  for (const o of ops) if (Number(o.montant) > 0) (credits.get(Number(o.montant).toFixed(2)) ?? credits.set(Number(o.montant).toFixed(2), []).get(Number(o.montant).toFixed(2))!).push(o);
  const used = new Set<number>();
  const pairs: number[] = [];
  for (const d of ops) {
    if (Number(d.montant) >= 0) continue;
    const list = credits.get((-Number(d.montant)).toFixed(2)) ?? [];
    const match = list.find((c) => !used.has(c.id) && c.compte_id !== d.compte_id && Math.abs(Date.parse(c.date_op) - Date.parse(d.date_op)) <= 3 * 86_400_000);
    if (match) {
      used.add(match.id);
      pairs.push(d.id, match.id);
    }
  }
  const toMark = pairs.filter((id) => !ops.find((o) => o.id === id)?.virement_interne);
  for (let i = 0; i < toMark.length; i += 500) await db.from("banque_operations").update({ virement_interne: true }).in("id", toMark.slice(i, i + 500));
}
