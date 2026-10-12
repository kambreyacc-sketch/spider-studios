import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { spiderPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.spiderPrisma ??
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.spiderPrisma = prisma;
