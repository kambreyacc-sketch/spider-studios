import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "spider_session";
type SessionPayload = { userId: string; discordId: string; exp: number };

function secret() {
  const value = process.env.DISCORD_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("DISCORD_SESSION_SECRET must be configured with a random value of at least 32 characters.");
  return value;
}
function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(data: Omit<SessionPayload, "exp">) {
  const payload = Buffer.from(JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14 })).toString("base64url");
  return payload + "." + signature(payload);
}

function verifyToken(token: string): SessionPayload | null {
  const [payload, supplied, extra] = token.split(".");
  if (!payload || !supplied || extra) return null;
  const expected = signature(payload);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (!parsed.userId || !parsed.discordId || !Number.isFinite(parsed.exp) || parsed.exp <= Date.now() / 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  let session: SessionPayload | null;
  try { session = verifyToken(token); } catch { return null; }
  if (!session) return null;
  return prisma.user.findFirst({
    where: { id: session.userId, discordId: session.discordId },
    select: { id: true, discordId: true, discordUsername: true, discordAvatar: true, stripeCustomerId: true },
  });
}

export const sessionCookieName = COOKIE_NAME;
