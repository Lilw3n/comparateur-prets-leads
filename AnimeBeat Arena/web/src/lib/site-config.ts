import { getPrisma } from "@/lib/prisma";

const SITE_CONFIG_ID = 1;
const DEFAULT_CONFIG = {
  id: SITE_CONFIG_ID,
  liveTvEnabled: true,
  updatedAt: new Date(0),
};

/**
 * Tolère l’absence de Postgres pendant le build (ex. .env encore en SQLite)
 * ou une erreur réseau : évite de casser le prerender des pages statiques.
 */
export async function getSiteConfig() {
  try {
    const prisma = getPrisma();
    return await prisma.siteConfig.upsert({
      where: { id: SITE_CONFIG_ID },
      update: {},
      create: { id: SITE_CONFIG_ID, liveTvEnabled: true },
    });
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function setLiveTvEnabled(enabled: boolean) {
  const prisma = getPrisma();
  return prisma.siteConfig.upsert({
    where: { id: SITE_CONFIG_ID },
    update: { liveTvEnabled: enabled },
    create: { id: SITE_CONFIG_ID, liveTvEnabled: enabled },
  });
}
