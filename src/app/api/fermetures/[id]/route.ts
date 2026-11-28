import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/fermetures/[id]">) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return bad("Identifiant invalide.");
  const { error } = await u.supabase.from("fermetures").delete().eq("id", id);
  if (error) return fail(error.message);
  return json({ ok: true });
}
