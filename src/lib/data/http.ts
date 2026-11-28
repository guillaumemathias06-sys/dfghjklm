import { NextResponse } from "next/server";
export const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
export const unauthorized = () => json({ error: "Session expirée : reconnectez-vous." }, 401);
export const bad = (message: string) => json({ error: message }, 400);
export const fail = (message: string) => json({ error: message }, 500);
