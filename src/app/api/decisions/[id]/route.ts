import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";
import { decisionSchema } from "@/lib/data/schemas";

const UUID = /^[0-9a-f-]{36}$/;

export async function PUT(req: Request, ctx: RouteContext<"/api/decisions/[id]">) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const { id } = await ctx.params;
  if (!UUID.test(id)) return bad("Identifiant invalide.");
  const parsed = decisionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("Données de décision invalides.");
  if (parsed.data.prioritaire) {
    const { count } = await u.supabase.from("decisions").select("id", { count: "exact", head: true }).eq("prioritaire", true).neq("id", id);
    if ((count ?? 0) >= 3) return bad("Trois actions prioritaires sont déjà sélectionnées. Retirez-en une avant d'en ajouter une autre.");
  }
  const { data, error } = await u.supabase.from("decisions").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return fail(error.message);
  return json(data);
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/decisions/[id]">) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const { id } = await ctx.params;
  if (!UUID.test(id)) return bad("Identifiant invalide.");
  const { error } = await u.supabase.from("decisions").delete().eq("id", id);
  if (error) return fail(error.message);
  return json({ ok: true });
}
