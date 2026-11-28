import { describe, it, expect } from "vitest";
import { computeBanque, type CompteRow, type OperationRow } from "../banque";

const c = (id: number, structure: string, solde: number | null): CompteRow => ({ id, nom: `Compte ${id}`, banque: "Banque", structure, solde, a_venir: null, actif: true, etat: null, synchro_le: "2026-11-28T05:00:00Z" });
const o = (compte_id: number, date_op: string, montant: number, extra: Partial<OperationRow> = {}): OperationRow => ({ compte_id, date_op, montant, a_venir: false, virement_interne: false, ...extra });

describe("computeBanque", () => {
  const comptes = [c(1, "Association", 10000), c(2, "SARL", 5000)];
  const ops = [o(1, "2026-11-10", 3000), o(1, "2026-11-12", -1200), o(2, "2026-11-12", 800), o(1, "2026-11-15", -500, { virement_interne: true }), o(2, "2026-11-15", 500, { virement_interne: true }), o(2, "2026-12-01", 2000, { a_venir: true }), o(1, "2026-10-01", 999)];
  it("additionne soldes et mouvements, sans virements internes ni opérations à venir", () => {
    const m = computeBanque(comptes, ops, { debut: "2026-11-01", fin: "2026-11-28", structure: "" });
    expect(m.solde).toMatchObject({ status: "ok", value: 15000 });
    expect(m.encaissements).toMatchObject({ value: 3000 - 1200 + 800 });
  });
  it("filtre par structure", () => {
    const m = computeBanque(comptes, ops, { debut: "2026-11-01", fin: "2026-11-28", structure: "SARL" });
    expect(m.solde).toMatchObject({ value: 5000 });
    expect(m.encaissements).toMatchObject({ value: 800 });
  });
  it("est indisponible sans compte ou sans solde", () => {
    expect(computeBanque([], [], { debut: "2026-11-01", fin: "2026-11-28", structure: "" }).solde.status).toBe("na");
    expect(computeBanque([c(3, "", null)], [], { debut: "2026-11-01", fin: "2026-11-28", structure: "" }).solde.status).toBe("na");
  });
});
