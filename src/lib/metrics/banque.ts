/**
 * Fiches Finance alimentées par les comptes bancaires (Powens).
 * Encaissements et décaissements : par date de l'opération, virements internes exclus.
 * Les opérations « à venir » annoncées par la banque sont présentées à part, jamais additionnées au réalisé.
 */
import type { Metric } from "./terrains";

export interface CompteRow {
  id: number | string;
  nom: string;
  banque: string | null;
  structure: string;
  solde: number | string | null;
  a_venir: number | string | null;
  actif: boolean;
  etat: string | null;
  synchro_le: string | null;
}
export interface OperationRow {
  compte_id: number | string;
  date_op: string;
  montant: number | string;
  a_venir: boolean;
  virement_interne: boolean;
}

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const n = (v: number | string | null | undefined) => (v === null || v === undefined || v === "" ? null : Number(v));

export function computeBanque(comptes: CompteRow[], ops: OperationRow[], scope: { debut: string; fin: string; structure: string }): Record<string, Metric> {
  const NA = (reason: string): Metric => ({ status: "na", reason });
  const actifs = comptes.filter((c) => c.actif && (!scope.structure || c.structure === scope.structure));
  if (!comptes.length) return { solde: NA("Aucun compte bancaire connecté : connectez vos banques dans Réglages."), encaissements: NA("Aucun compte bancaire connecté : connectez vos banques dans Réglages.") };
  if (!actifs.length) return { solde: NA(`Aucun compte rattaché à la structure « ${scope.structure} » : rattachez vos comptes dans Réglages.`), encaissements: NA(`Aucun compte rattaché à la structure « ${scope.structure} ».`) };
  const sansStructure = comptes.filter((c) => c.actif && !c.structure).length;
  const ids = new Set(actifs.map((c) => String(c.id)));
  const out: Record<string, Metric> = {};

  const soldes = actifs.map((c) => n(c.solde));
  const sync = actifs.map((c) => c.synchro_le).filter(Boolean).sort()[0] ?? null;
  if (soldes.some((s) => s === null)) out.solde = NA("Un compte ne communique pas son solde : total indisponible.");
  else {
    const total: number = soldes.reduce((s: number, v) => s + (v ?? 0), 0);
    const aVenir = actifs.reduce((s, c) => s + (n(c.a_venir) ?? 0), 0);
    out.solde = {
      status: "ok",
      value: total,
      unit: "€",
      display: eur.format(total),
      periode: sync ? `Au ${new Date(sync).toLocaleDateString("fr-FR")}` : undefined,
      lines: [
        ...actifs.map((c) => `${c.nom}${c.banque ? ` (${c.banque})` : ""}${c.structure ? ` · ${c.structure}` : " · structure à préciser"} : ${eur.format(n(c.solde) ?? 0)}`),
        ...(aVenir ? [`Opérations à venir annoncées par la banque : ${aVenir >= 0 ? "+" : ""}${eur.format(aVenir)}, soit ${eur.format(total + aVenir)} après passage.`] : []),
        ...(sansStructure ? [`${sansStructure} compte(s) sans structure : rattachez-les dans Réglages pour séparer association et SARL.`] : []),
        ...(actifs.some((c) => c.etat) ? ["Une banque demande de renouveler le consentement : le solde peut dater de la dernière synchronisation réussie."] : []),
      ],
    };
  }

  let credit = 0;
  let debit = 0;
  let internes = 0;
  let futCredit = 0;
  let futDebit = 0;
  let nb = 0;
  for (const o of ops) {
    if (!ids.has(String(o.compte_id))) continue;
    const v = Number(o.montant);
    if (o.a_venir) {
      if (v >= 0) futCredit += v;
      else futDebit += v;
      continue;
    }
    if (o.date_op < scope.debut || o.date_op >= scope.fin) continue;
    if (o.virement_interne) {
      internes++;
      continue;
    }
    nb++;
    if (v >= 0) credit += v;
    else debit += v;
  }
  out.encaissements = {
    status: "ok",
    value: credit + debit,
    unit: "€",
    display: `+${eur.format(credit)} / ${eur.format(debit)}`,
    lines: [
      `Encaissements ${eur.format(credit)}, décaissements ${eur.format(-debit)}, solde des mouvements ${eur.format(credit + debit)} (${nb} opération(s), par date d'opération).`,
      ...(internes ? [`${internes} opération(s) de virement entre vos propres comptes exclue(s) pour éviter le double comptage.`] : []),
      ...(futCredit || futDebit ? [`À venir (annoncé par la banque, non compté) : +${eur.format(futCredit)} / ${eur.format(futDebit)}.`] : []),
      "Mouvements bancaires : ce n'est pas le chiffre d'affaires comptable.",
    ],
  };
  return out;
}
