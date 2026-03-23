import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function isPostgresUrl(url: string): boolean {
  return /^(postgres(ql)?:\/\/)/i.test(url.trim());
}

/**
 * Local : `DATABASE_URL=file:./prisma/dev.db` → SQLite + client généré depuis schema.sqlite.prisma.
 * Vercel / Neon : `postgresql://...` → Postgres + client généré depuis schema.postgresql.prisma.
 * Le script `scripts/sync-prisma-schema.cjs` copie le bon schéma avant chaque `prisma generate`.
 */
export function getPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL manquant. Local : file:./prisma/dev.db — Prod : postgresql://… (Neon)",
    );
  }
  if (!globalForPrisma.prisma) {
    if (isPostgresUrl(url)) {
      const adapter = new PrismaPg({
        connectionString: url,
        max: Number(process.env.PG_POOL_MAX ?? 10),
        idleTimeoutMillis: 20_000,
        connectionTimeoutMillis: 10_000,
      });
      globalForPrisma.prisma = new PrismaClient({ adapter });
    } else {
      const adapter = new PrismaBetterSqlite3({ url: url as ":memory:" | (string & {}) });
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
  }
  return globalForPrisma.prisma;
}
