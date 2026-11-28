import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";
import { decisionSchema } from "@/lib/data/schemas";

export async function POST(req: Request) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const parsed = decisionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("Données de décision invalides.");
  if (parsed.data.prioritaire) {
    const { count } = await u.supabase.from("decisions").select("id", { count: "exact", head: true }).eq("prioritaire", true);
    if ((count ?? 0) >= 3) return bad("Trois actions prioritaires sont déjà sélectionnées. Retirez-en une avant d'en ajouter une autre.");
  }
  const { data, error } = await u.supabase.from("decisions").insert(parsed.data).select().single();
  if (error) return fail(error.message);
  return json(data, 201);
}
