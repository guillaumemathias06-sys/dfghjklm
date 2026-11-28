import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, fail } from "@/lib/data/http";
import { loadReglages, loadBookings, lastSync } from "@/lib/data/load";
import { countCourts } from "@/lib/metrics/terrains";
import { playtomicConfig } from "@/lib/playtomic/api";

export const dynamic = "force-dynamic";

/** Tout ce que l'écran doit connaître au démarrage. */
export async function GET() {
  const ctx = await requireUser();
  if (!ctx) return unauthorized();
  const db = ctx.supabase;
  const [notes, decisions, reglages, bookings, syncs] = await Promise.all([
    db.from("fiche_notes").select("*"),
    db.from("decisions").select("*").order("created_at", { ascending: false }),
    loadReglages(db),
    loadBookings(db),
    lastSync(db),
  ]);
  if (notes.error || decisions.error) return fail(notes.error?.message ?? decisions.error?.message ?? "Lecture impossible.");
  const playtomicCourts = countCourts(bookings.data, { ...reglages, terrains: {} }).bySport;
  return json({
    notes: notes.data,
    decisions: decisions.data,
    reglages,
    playtomic: { configure: playtomicConfig() !== null, reservations: bookings.data.length, terrainsVus: playtomicCourts, syncs },
  });
}
