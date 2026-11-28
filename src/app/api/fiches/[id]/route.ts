import { requireUser } from "@/lib/supabase/server";
import { json, unauthorized, bad, fail } from "@/lib/data/http";
import { noteSchema } from "@/lib/data/schemas";

export async function PUT(req: Request, ctx: RouteContext<"/api/fiches/[id]">) {
  const u = await requireUser();
  if (!u) return unauthorized();
  const { id } = await ctx.params;
  if (!/^[a-z0-9-]{1,60}$/.test(id)) return bad("Identifiant de fiche invalide.");
  const parsed = noteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad("Données de fiche invalides.");
  const { data, error } = await u.supabase
    .from("fiche_notes")
    .upsert({ indicator_id: id, ...parsed.data, updated_at: new Date().toISOString() }, { onConflict: "indicator_id" })
    .select()
    .single();
  if (error) return fail(error.message);
  return json(data);
}
