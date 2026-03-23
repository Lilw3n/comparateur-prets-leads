import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL manquant. Ex. file:./prisma/dev.db — voir .env.example.",
    );
  }
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: url as ":memory:" | (string & {}) });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
