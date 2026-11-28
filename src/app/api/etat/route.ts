import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, fail } from "@/lib/data/http";
import { loadReglages, loadAllBookings, lastSync, loadFermetures } from "@/lib/data/load";
import { powensConfig } from "@/lib/banque/powens";
import { countCourts, canonicalSport } from "@/lib/metrics/terrains";
import { playtomicConfig } from "@/lib/playtomic/api";

export const dynamic = "force-dynamic";

/** Tout ce que l'écran doit connaître au démarrage. */
export async function GET() {
  const ctx = await requireUser();
  if (!ctx) return unauthorized();
  const db = ctx.supabase;
  const [notes, decisions, reglages, bookings, syncs, fermetures] = await Promise.all([
    db.from("fiche_notes").select("*"),
    db.from("decisions").select("*").order("created_at", { ascending: false }),
    loadReglages(db),
    loadAllBookings(db),
    lastSync(db),
    loadFermetures(db),
  ]);
  const [comptes, bankSyncs] = await Promise.all([db.from("banque_comptes").select("id, nom, banque, iban_masque, type, structure, solde, a_venir, actif, etat, synchro_le").order("nom"), lastSync(db, "banque")]);
  const exclus = new Set(reglages.exclus ?? []);
  const vus = bookings.data.filter((b) => !b.resource_id || !exclus.has(b.resource_id));
  if (notes.error || decisions.error) return fail(notes.error?.message ?? decisions.error?.message ?? "Lecture impossible.");
  const playtomicCourts = countCourts(vus, { ...reglages, terrains: {} }).bySport;
  // Liste des terrains vus dans Playtomic, pour le registre des fermetures.
  const courtMap = new Map<string, { id: string; nom: string; sport: string }>();
  for (const b of bookings.data) {
    const sp = canonicalSport(b.sport_id);
    if (b.resource_id && sp && !courtMap.has(b.resource_id)) courtMap.set(b.resource_id, { id: b.resource_id, nom: b.resource_name ?? b.resource_id, sport: sp });
  }
  const terrains = [...courtMap.values()].sort((a, b) => a.sport.localeCompare(b.sport) || a.nom.localeCompare(b.nom, "fr", { numeric: true }));
  return json({
    notes: notes.data,
    decisions: decisions.data,
    reglages,
    playtomic: { configure: playtomicConfig() !== null, reservations: bookings.data.length, terrainsVus: playtomicCourts, syncs },
    terrains: terrains.map((c) => ({ ...c, exclu: exclus.has(c.id) })),
    fermetures,
    banque: { configure: powensConfig() !== null, comptes: (comptes.data ?? []).map((c) => ({ ...c, id: String(c.id) })), syncs: bankSyncs },
  });
}
