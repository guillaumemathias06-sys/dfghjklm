import { z } from "zod";
import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";

const schema = z.object({
  debut: z.string().datetime({ offset: true }),
  fin: z.string().datetime({ offset: true }),
  terrains: z.array(z.string().max(80)).max(50),
  cause: z.enum(["pluie", "humidite", "chaleur", "panne", "autre"]),
  note: z.string().trim().max(500),
});

export async function POST(req: Request) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("Fermeture invalide : vérifiez les dates.");
  if (Date.parse(parsed.data.fin) <= Date.parse(parsed.data.debut)) return bad("La fin de la fermeture doit suivre son début.");
  const { data, error } = await u.supabase.from("fermetures").insert(parsed.data).select().single();
  if (error) return fail(error.message);
  return json(data, 201);
}
