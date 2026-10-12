import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!clientId || !appUrl) return NextResponse.json({ error: "Discord sign-in is not configured on this deployment." }, { status: 503 });
  const origin = appUrl.startsWith("http") ? appUrl.replace(/\/$/, "") : `https://${appUrl.replace(/\/$/, "")}`;
  const state = randomBytes(32).toString("base64url");
  const response = NextResponse.redirect(new URL("https://discord.com/oauth2/authorize?" + new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: origin + "/api/auth/discord/callback",
    scope: "identify",
    state,
  }).toString()));
  response.cookies.set("spider_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
  return response;
}
