import { describe, it, expect } from "vitest";
import { computeEquipe, type PaieRow } from "../equipe";

const row = (mois: string, categorie: string, cout: number, heures: number, exceptionnel = 0): PaieRow => ({ mois, categorie, effectif: 1, heures, brut: cout * 0.85, charges: cout * 0.15, cout, exceptionnel, note: exceptionnel ? "départ" : "" });
const rows = [row("2026-09-01", "Encadrement sportif", 2000, 100, 300), row("2026-09-01", "Apprentis", 1000, 151.67), row("2026-10-01", "Encadrement sportif", 1500, 90), row("2026-10-01", "Apprentis", 1000, 151.67)];

describe("computeEquipe", () => {
  it("prend le dernier mois de paie terminé avant la fin de période", () => {
    const r = computeEquipe(rows, "2026-11-28", true);
    expect(r.mesures["cout-personnel"]).toMatchObject({ status: "ok", value: 2500, periode: "Paie de octobre 2026" });
    expect(r.tendances["cout-personnel"]).toBe("−17 % vs septembre");
    const s = computeEquipe(rows, "2026-10-31", true);
    expect(s.mesures["cout-personnel"]).toMatchObject({ value: 3000 });
  });
  it("est indisponible sans paie, jamais zéro", () => {
    expect(computeEquipe([], "2026-11-28", true).mesures["cout-personnel"].status).toBe("na");
    expect(computeEquipe(rows, "2026-09-15", true).mesures["cout-personnel"].status).toBe("na");
  });
});
