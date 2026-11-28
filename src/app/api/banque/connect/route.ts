import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { powensConfig, tempCode } from "@/lib/banque/powens";
import { getToken } from "@/lib/banque/sync";

/** Ouvre la webview Powens pour connecter (ou renouveler) une banque. */
export async function GET(req: Request) {
  const u = await requireUser();
  const origin = new URL(req.url).origin;
  const back = (s: string) => NextResponse.redirect(`${origin}/?banque=${encodeURIComponent(s)}#reglages`);
  if (!u) return NextResponse.redirect(`${origin}/login`);
  const cfg = powensConfig();
  if (!cfg) return back("non_configure");
  try {
    const token = await getToken(createAdminClient(), true);
    const code = await tempCode(token);
    const state = crypto.randomBytes(24).toString("base64url");
    (await cookies()).set("banque_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 900, path: "/api/banque" });
    const url = new URL("https://webview.powens.com/connect");
    url.searchParams.set("domain", cfg.domain);
    url.searchParams.set("client_id", cfg.clientId);
    url.searchParams.set("redirect_uri", `${origin}/api/banque/callback`);
    url.searchParams.set("code", code);
    url.searchParams.set("state", state);
    url.searchParams.set("connector_capabilities", "bank");
    return NextResponse.redirect(url.toString());
  } catch (e) {
    return back(e instanceof Error ? e.message : "erreur");
  }
}
