import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, fail } from "@/lib/data/http";
import { loadReglages, loadBookings, lastSync, loadFermetures } from "@/lib/data/load";
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
    loadBookings(db),
    lastSync(db),
    loadFermetures(db),
  ]);
  if (notes.error || decisions.error) return fail(notes.error?.message ?? decisions.error?.message ?? "Lecture impossible.");
  const playtomicCourts = countCourts(bookings.data, { ...reglages, terrains: {} }).bySport;
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
    terrains,
    fermetures,
  });
}
