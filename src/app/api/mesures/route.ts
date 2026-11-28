import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";
import { loadReglages, loadBookings, lastSync } from "@/lib/data/load";
import { computeEquipe, type PaieRow } from "@/lib/metrics/equipe";
import { computeTerrains, resolvePeriode, previousPeriode, trend, PERIODES, type PeriodeId, type Sport, type Creneau } from "@/lib/metrics/terrains";

export const dynamic = "force-dynamic";

const SPORTS: Record<string, Sport> = { Padel: "PADEL", Tennis: "TENNIS", "Foot à 5": "FOOTBALL" };
const CRENEAUX: Record<string, Creneau> = { Journée: "journee", Soirée: "soiree", "Week-end": "weekend" };

/** Mesures Terrains calculées depuis Playtomic pour une période, un sport et un créneau. */
export async function GET(req: Request) {
  const ctx = await requireUser();
  if (!ctx) return unauthorized();
  const url = new URL(req.url);
  const periodeId = (url.searchParams.get("periode") || "28j") as PeriodeId;
  if (!(periodeId in PERIODES)) return bad("Période inconnue.");
  const sportLbl = url.searchParams.get("sport") || "";
  const creneauLbl = url.searchParams.get("creneau") || "";
  if (sportLbl && !SPORTS[sportLbl]) return bad("Sport inconnu.");
  if (creneauLbl && !CRENEAUX[creneauLbl]) return bad("Créneau inconnu.");

  const [reglages, bookings, syncs, paie] = await Promise.all([
    loadReglages(ctx.supabase),
    loadBookings(ctx.supabase),
    lastSync(ctx.supabase),
    ctx.supabase.from("paie_mensuelle").select("*").order("mois"),
  ]);
  if (bookings.error) return fail(`Lecture des réservations impossible : ${bookings.error}`);
  const p = resolvePeriode(periodeId);
  // Équipe : indépendant de Playtomic, du sport et du créneau.
  const equipe = computeEquipe((paie.data ?? []) as PaieRow[], p.fin, true);
  const lastOk = syncs.find((s) => s.status === "completed" || s.status === "partial");
  if (!lastOk)
    return json({ connecte: false, raison: "Aucune synchronisation Playtomic réussie pour l'instant.", periode: { id: periodeId, libelle: PERIODES[periodeId], ...p }, mesures: equipe.mesures, tendances: equipe.tendances, sources: { paie: (paie.data ?? []).length > 0 } });

  const prev = previousPeriode(periodeId, p);
  const scope = { sport: sportLbl ? SPORTS[sportLbl] : null, creneau: creneauLbl ? CRENEAUX[creneauLbl] : null };
  const cur = computeTerrains(bookings.data, reglages, { ...scope, ...p });
  const before = computeTerrains(bookings.data, reglages, { ...scope, ...prev });
  const tendances: Record<string, string | null> = {};
  for (const id of Object.keys(cur)) tendances[id] = trend(cur[id], before[id]);
  Object.assign(cur, equipe.mesures);
  Object.assign(tendances, equipe.tendances);
  return json({
    connecte: true,
    periode: { id: periodeId, libelle: PERIODES[periodeId], ...p, precedente: prev },
    synchro: lastOk.finished_at ?? lastOk.started_at,
    mesures: cur,
    tendances,
    sources: { paie: (paie.data ?? []).length > 0 },
  });
}
