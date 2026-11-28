import { z } from "zod";

const date = z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).transform((v) => (v === "" ? null : v));
const text = (max: number) => z.string().trim().max(max);

export const noteSchema = z.object({
  responsable: text(200),
  source: text(400),
  date_cible: date,
  process: text(2000),
  prochaine: text(2000),
  avancement: z.enum(["À relier", "Process en cours", "Prêt à relier"]),
});

export const decisionSchema = z.object({
  titre: text(300).min(1),
  responsable: text(200),
  echeance: date,
  perimetre: z.enum(["", "BtoC", "BtoB", "Commun"]),
  indicator_id: text(60),
  constat: text(2000),
  attendu: text(2000),
  statut: z.enum(["À faire", "En cours", "Terminée"]),
  prioritaire: z.boolean(),
});

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const jour = z.object({ open: hhmm, close: hhmm }).nullable();
export const reglagesSchema = z.object({
  horaires: z.object({ mon: jour, tue: jour, wed: jour, thu: jour, fri: jour, sat: jour, sun: jour }),
  debut_soiree: hhmm,
  terrains: z.object({ PADEL: z.number().int().min(0).max(50).nullable(), TENNIS: z.number().int().min(0).max(50).nullable(), FOOTBALL: z.number().int().min(0).max(50).nullable() }),
});
