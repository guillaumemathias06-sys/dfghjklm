import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";
import { reglagesSchema } from "@/lib/data/schemas";

export async function PUT(req: Request) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const parsed = reglagesSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("Réglages invalides : vérifiez le format des heures (HH:MM).");
  const v = parsed.data;
  for (const [d, h] of Object.entries(v.horaires)) if (h && h.close !== "00:00" && h.close <= h.open) return bad(`Horaire du ${d} : la fermeture doit suivre l'ouverture.`);
  const horaires = Object.fromEntries(Object.entries(v.horaires).filter(([, h]) => h));
  const terrains = Object.fromEntries(Object.entries(v.terrains).filter(([, n]) => typeof n === "number" && n > 0));
  const { error } = await u.supabase.from("reglages").upsert({ id: 1, horaires, debut_soiree: v.debut_soiree, terrains, updated_at: new Date().toISOString() });
  if (error) return fail(error.message);
  return json({ ok: true });
}
