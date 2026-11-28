import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { selectAll } from "@/lib/supabase/selectAll";
import type { BookingRow, Fermeture, Reglages } from "@/lib/metrics/terrains";

export async function loadFermetures(db: SupabaseClient): Promise<(Fermeture & { note: string })[]> {
  const { data } = await db.from("fermetures").select("id, debut, fin, terrains, cause, note").order("created_at");
  return (data ?? []) as (Fermeture & { note: string })[];
}


export async function loadReglages(db: SupabaseClient): Promise<Reglages> {
  const { data } = await db.from("reglages").select("horaires, debut_soiree, terrains").eq("id", 1).maybeSingle();
  return {
    horaires: (data?.horaires as Reglages["horaires"]) ?? {},
    debut_soiree: typeof data?.debut_soiree === "string" ? data.debut_soiree : "18:00",
    terrains: (data?.terrains as Reglages["terrains"]) ?? {},
  };
}

export async function loadBookings(db: SupabaseClient): Promise<{ data: BookingRow[]; error: string | null }> {
  return selectAll<BookingRow>((from, to) =>
    db.from("playtomic_bookings").select("booking_id, resource_id, resource_name, sport_id, booking_type, start_at, end_at, price_amount, price_currency, is_canceled").order("booking_id").range(from, to)
  );
}

export async function lastSync(db: SupabaseClient) {
  const { data } = await db.from("sync_runs").select("started_at, finished_at, status, records_read, records_skipped, error, triggered_by").order("id", { ascending: false }).limit(5);
  return data ?? [];
}
