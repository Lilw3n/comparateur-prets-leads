/**
 * Promouvoir manuellement un utilisateur existant : ADMIN_EMAIL doit être dans .env
 * Usage : npm run grant-admin
 */
import "dotenv/config";
import { Role } from "../src/generated/prisma";
import { getPrisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) {
    console.error("ADMIN_EMAIL manquant dans .env");
    process.exit(1);
  }

  const prisma = getPrisma();
  const result = await prisma.user.updateMany({
    where: { email },
    data: { role: Role.ADMIN },
  });

  console.log(`Comptes mis à jour : ${result.count} (email: ${email})`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
