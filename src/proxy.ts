import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 : `proxy.ts` remplace `middleware.ts`. Garde la session Supabase
// à jour et renvoie vers /login toute personne non connectée.
export async function proxy(request: NextRequest) {
  // Vercel Cron n'a pas de session : la route vérifie CRON_SECRET elle-même.
  if (request.nextUrl.pathname.startsWith("/api/cron/")) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isLogin = path === "/login";
  if (!data.user && !isLogin) {
    if (path.startsWith("/api/")) return NextResponse.json({ error: "Session expirée : reconnectez-vous." }, { status: 401 });
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (data.user && isLogin) return NextResponse.redirect(new URL("/", request.url));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|app.js|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
