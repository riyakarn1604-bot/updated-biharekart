import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in production environment");
}
const dbUrl = process.env.DATABASE_URL || "file:./dev.db";

const libsql = createClient({
  url: dbUrl,
});
// @ts-expect-error type mismatch between libsql client and prisma adapter
const adapter = new PrismaLibSql(libsql);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
