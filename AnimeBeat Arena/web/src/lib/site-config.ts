import { getPrisma } from "@/lib/prisma";

const SITE_CONFIG_ID = 1;
const DEFAULT_CONFIG = {
  id: SITE_CONFIG_ID,
  liveTvEnabled: true,
  updatedAt: new Date(0),
};

export async function getSiteConfig() {
  const prisma = getPrisma();
  const model = (prisma as unknown as { siteConfig?: { upsert: Function } }).siteConfig;
  if (!model?.upsert) {
    // Fallback de sécurité: si le client Prisma n'a pas encore le modèle (cache/dev), on ne casse pas la page.
    return DEFAULT_CONFIG;
  }
  return model.upsert({
    where: { id: SITE_CONFIG_ID },
    update: {},
    create: { id: SITE_CONFIG_ID, liveTvEnabled: true },
  });
}

export async function setLiveTvEnabled(enabled: boolean) {
  const prisma = getPrisma();
  const model = (prisma as unknown as { siteConfig?: { upsert: Function } }).siteConfig;
  if (!model?.upsert) {
    return { ...DEFAULT_CONFIG, liveTvEnabled: enabled };
  }
  return model.upsert({
    where: { id: SITE_CONFIG_ID },
    update: { liveTvEnabled: enabled },
    create: { id: SITE_CONFIG_ID, liveTvEnabled: enabled },
  });
}

