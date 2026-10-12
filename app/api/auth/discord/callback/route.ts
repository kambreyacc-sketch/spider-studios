import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { createSessionToken, sessionCookieName } from "../../../../../lib/session";

type DiscordUser = { id: string; username: string; avatar: string | null };

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("spider_oauth_state")?.value;
  const fail = (reason: string, status = 400) => NextResponse.json({ error: reason }, { status });

  if (error) return fail("Discord sign-in was cancelled.");
  if (!code || !state || !expectedState || state !== expectedState) return fail("Discord sign-in state validation failed.");
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!clientId || !clientSecret || !appUrl) return fail("Discord OAuth is not fully configured on this deployment.", 503);
  if (!process.env.DATABASE_URL) return fail("Account storage is not configured. Set DATABASE_URL before enabling sign-in.", 503);
  const origin = appUrl.startsWith("http") ? appUrl.replace(/\/$/, "") : `https://${appUrl.replace(/\/$/, "")}`;
  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: origin + "/api/auth/discord/callback",
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return fail("Discord could not complete sign-in. Please try again.", 502);
    const token = await tokenResponse.json() as { access_token?: string; token_type?: string };
    if (!token.access_token) return fail("Discord did not return an access token.", 502);
    const profileResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `${token.token_type || "Bearer"} ${token.access_token}` },
      cache: "no-store",
    });
    if (!profileResponse.ok) return fail("Unable to verify the Discord account.", 502);
    const profile = await profileResponse.json() as DiscordUser;
    if (!profile.id || !profile.username) return fail("Discord returned an invalid account profile.", 502);
    const user = await prisma.user.upsert({
      where: { discordId: profile.id },
      create: { discordId: profile.id, discordUsername: profile.username, discordAvatar: profile.avatar },
      update: { discordUsername: profile.username, discordAvatar: profile.avatar },
      select: { id: true, discordId: true },
    });
    const response = NextResponse.redirect(new URL("/dashboard/settings?tab=billing", origin));
    response.cookies.set(sessionCookieName, createSessionToken({ userId: user.id, discordId: user.discordId }), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
    });
    response.cookies.delete("spider_oauth_state");
    return response;
  } catch (e) {
    console.error("Discord OAuth callback failed", e instanceof Error ? e.message : "unknown error");
    return fail("Sign-in could not be completed. Check server configuration and try again.", 500);
  }
}
