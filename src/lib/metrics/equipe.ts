/**
 * Fiches « Équipe » à partir de la masse salariale mensuelle (bulletins de paie).
 * La paie est mensuelle : on montre le dernier mois de paie terminé avant la fin
 * de la période choisie, jamais une proratisation inventée.
 */
import type { Metric } from "./terrains";

export interface PaieRow {
  mois: string; // AAAA-MM-01
  categorie: string;
  effectif: number;
  heures: number | string;
  brut: number | string;
  charges: number | string;
  cout: number | string;
  exceptionnel: number | string;
  note: string;
}

const eur0 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const nf0 = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export const moisLabel = (m: string) => `${MOIS[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`;
const n = (v: number | string) => Number(v) || 0;

export function computeEquipe(rows: PaieRow[], finPeriode: string, hypotheseConstante: boolean): { mesures: Record<string, Metric>; tendances: Record<string, string | null> } {
  const months = [...new Set(rows.map((r) => r.mois.slice(0, 10)))].sort();
  // Dernier mois de paie dont le mois est entièrement passé à la fin de la période.
  const eligible = months.filter((m) => {
    const next = new Date(`${m}T12:00:00Z`);
    next.setUTCMonth(next.getUTCMonth() + 1);
    return next.toISOString().slice(0, 10) <= finPeriode;
  });
  const NA: Metric = { status: "na", reason: rows.length ? "Aucun mois de paie complet avant la fin de cette période." : "Masse salariale non importée : aucun bulletin de paie en base." };
  if (!eligible.length) return { mesures: { "cout-personnel": NA, "heures-equipe": NA }, tendances: {} };
  const cur = eligible[eligible.length - 1];
  const prev = eligible.length > 1 ? eligible[eligible.length - 2] : null;
  const of = (m: string) => rows.filter((r) => r.mois.slice(0, 10) === m);
  const sum = (rs: PaieRow[], k: keyof PaieRow) => rs.reduce((s, r) => s + n(r[k] as number), 0);
  const c = of(cur);
  const cout = sum(c, "cout");
  const exc = sum(c, "exceptionnel");
  const heures = sum(c, "heures");
  const effectif = c.reduce((s, r) => s + r.effectif, 0);
  const year = cur.slice(0, 4);
  const ytd = rows.filter((r) => r.mois.startsWith(year) && r.mois.slice(0, 10) <= cur);
  const last12 = months.filter((m) => m <= cur).slice(-12);
  const avg12 = last12.length === 12 ? last12.reduce((s, m) => s + sum(of(m), "cout") - sum(of(m), "exceptionnel"), 0) / 12 : null;
  const lines = [
    `Paie de ${moisLabel(cur)} : ${effectif} salarié(s), brut ${eur0.format(sum(c, "brut"))}, charges patronales ${eur0.format(sum(c, "charges"))} après allègements.`,
    ...c.map((r) => `${r.categorie} : ${eur0.format(n(r.cout))} (${r.effectif} pers.)`),
    ...(exc ? [`Dont ${eur0.format(exc)} non récurrents (${c.filter((r) => n(r.exceptionnel)).map((r) => r.note).join(" ; ")}).`] : []),
    `Cumul ${year} à fin ${moisLabel(cur)} : ${eur0.format(sum(ytd, "cout"))}.`,
    ...(avg12 !== null ? [`Moyenne des 12 derniers mois, hors éléments non récurrents : ${eur0.format(avg12)} par mois.`] : []),
    ...(hypotheseConstante ? [`Prévision : ${eur0.format(cout - exc)} par mois jusqu'en août 2027 (hypothèse de la direction : effectif constant, apprentis remplacés à la rentrée 2027).`] : []),
    "Ventilation par activité : à relier (affectation des heures au planning).",
  ];
  const mesures: Record<string, Metric> = {
    "cout-personnel": { status: "ok", value: cout, unit: "€", display: eur0.format(cout), lines, periode: `Paie de ${moisLabel(cur)}` },
    "heures-equipe": {
      status: "estimate",
      value: heures,
      unit: "h",
      display: `${nf0.format(heures)} h`,
      periode: `Paie de ${moisLabel(cur)}`,
      lines: [`Heures payées en ${moisLabel(cur)} d'après les bulletins (${effectif} salarié(s)).`, ...c.map((r) => `${r.categorie} : ${nf0.format(n(r.heures))} h`), "Heures prévues au planning et heures réellement travaillées : à relier. Les heures payées des apprentis incluent le temps de formation."],
    },
  };
  const tendances: Record<string, string | null> = {};
  if (prev) {
    const p = of(prev);
    const pc = sum(p, "cout");
    const ph = sum(p, "heures");
    tendances["cout-personnel"] = pc ? `${cout >= pc ? "+" : "−"}${nf0.format(Math.abs(((cout - pc) / pc) * 100))} % vs ${MOIS[Number(prev.slice(5, 7)) - 1]}` : null;
    tendances["heures-equipe"] = ph ? `${heures >= ph ? "+" : "−"}${nf0.format(Math.abs(((heures - ph) / ph) * 100))} % vs ${MOIS[Number(prev.slice(5, 7)) - 1]}` : null;
  }
  return { mesures, tendances };
}
