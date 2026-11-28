import { describe, it, expect } from "vitest";
import { computeTerrains, resolvePeriode, previousPeriode, parisParts, type BookingRow, type Reglages } from "../terrains";

const r: Reglages = {
  horaires: { mon: { open: "09:00", close: "23:00" }, tue: { open: "09:00", close: "23:00" }, sat: { open: "09:00", close: "21:00" } },
  debut_soiree: "18:00",
  terrains: {},
};
// 2026-11-16 est un lundi. 18:00 UTC = 19:00 à Paris (hiver).
const b = (id: string, court: string, start: string, end: string, extra: Partial<BookingRow> = {}): BookingRow => ({
  booking_id: id, resource_id: court, sport_id: "PADEL", booking_type: "REGULAR_BOOKING", start_at: start, end_at: end,
  price_amount: 36, price_currency: "EUR", is_canceled: false, ...extra,
});
const all = [
  b("1", "c1", "2026-11-16T18:00:00Z", "2026-11-16T19:30:00Z"), // lundi 19:00-20:30 soirée
  b("2", "c2", "2026-11-16T09:00:00Z", "2026-11-16T10:30:00Z"), // lundi 10:00-11:30 journée
  b("3", "c1", "2026-11-16T18:30:00Z", "2026-11-16T20:00:00Z", { booking_type: "COURSE", price_amount: null }), // chevauche 1 : 30 min en commun
  b("4", "c2", "2026-11-16T12:00:00Z", "2026-11-16T13:30:00Z", { is_canceled: true }),
  b("5", "c3", "2026-11-16T12:00:00Z", "2026-11-16T13:00:00Z", { sport_id: "FOOTBALL_OTHERS" }),
];

describe("computeTerrains", () => {
  it("compte capacité, réservations et occupation sur une journée", () => {
    const m = computeTerrains(all, r, { debut: "2026-11-16", fin: "2026-11-17", sport: "PADEL", creneau: null });
    expect(m.capacite).toMatchObject({ status: "ok", value: 28 }); // 2 terrains × 14 h
    expect(m.reservees).toMatchObject({ value: 3 }); // 1,5 h + 1,5 h
    // Cours 19:30-21:00 : 1 h en commun avec la location, 0,5 h en plus → louables 27,5 h.
    expect(m.louables).toMatchObject({ status: "estimate", value: 27.5 });
    expect((m.occupation as { value: number }).value).toBeCloseTo((3 / 27.5) * 100);
    expect((m.usage as { value: number }).value).toBeCloseTo((3.5 / 28) * 100);
    expect(m.annulations).toMatchObject({ value: 1 });
    expect((m["prix-heure"] as { value: number }).value).toBeCloseTo(72 / 3);
  });
  it("sépare journée et soirée en heure de Paris", () => {
    const soir = computeTerrains(all, r, { debut: "2026-11-16", fin: "2026-11-17", sport: "PADEL", creneau: "soiree" });
    expect(soir.reservees).toMatchObject({ value: 1.5 });
    expect(soir.capacite).toMatchObject({ value: 10 }); // 2 × 18-23
    const jour = computeTerrains(all, r, { debut: "2026-11-16", fin: "2026-11-17", sport: "PADEL", creneau: "journee" });
    expect(jour.reservees).toMatchObject({ value: 1.5 });
    const we = computeTerrains(all, r, { debut: "2026-11-16", fin: "2026-11-17", sport: "PADEL", creneau: "weekend" });
    expect(we.occupation.status).toBe("na");
  });
  it("rend indisponible sans horaires ou sans terrain, jamais zéro", () => {
    const m = computeTerrains(all, { ...r, horaires: {} }, { debut: "2026-11-16", fin: "2026-11-17", sport: "PADEL", creneau: null });
    expect(m.occupation.status).toBe("na");
    expect(m.capacite.status).toBe("na");
    const t = computeTerrains(all, r, { debut: "2026-11-16", fin: "2026-11-17", sport: "TENNIS", creneau: null });
    expect(t.occupation.status).toBe("na");
  });
  it("regroupe les variantes de football et utilise le réglage des terrains", () => {
    const m = computeTerrains(all, { ...r, terrains: { FOOTBALL: 3 } }, { debut: "2026-11-16", fin: "2026-11-17", sport: "FOOTBALL", creneau: null });
    expect(m.capacite).toMatchObject({ value: 42 });
    expect(m.reservees).toMatchObject({ value: 1 });
  });
});

describe("périodes", () => {
  it("s'arrêtent hier et ont une période précédente de même durée", () => {
    const now = new Date("2026-11-28T10:00:00Z");
    expect(resolvePeriode("7j", now)).toEqual({ debut: "2026-11-21", fin: "2026-11-28" });
    expect(previousPeriode("7j", resolvePeriode("7j", now))).toEqual({ debut: "2026-11-14", fin: "2026-11-21" });
    expect(resolvePeriode("mois-1", now)).toEqual({ debut: "2026-10-01", fin: "2026-11-01" });
    expect(previousPeriode("mois-1", resolvePeriode("mois-1", now))).toEqual({ debut: "2026-09-01", fin: "2026-10-01" });
    expect(parisParts("2026-07-01T22:30:00Z")).toEqual({ date: "2026-07-02", min: 30 });
  });
});
