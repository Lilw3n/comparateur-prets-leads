/**
 * Crée ou met à jour ton compte admin (email + mot de passe) pour pouvoir te connecter sur /login.
 *
 * Dans web/.env, mets au minimum :
 *   DATABASE_URL, AUTH_SECRET, AUTH_URL
 *   ADMIN_EMAIL=ton@email.com
 *   ADMIN_PASSWORD=ton_mot_de_passe   (8+ caractères, temporaire)
 *
 * Puis : npx prisma db push
 * Puis : npm run bootstrap-admin
 * Puis : supprime ADMIN_PASSWORD du .env (garde ADMIN_EMAIL).
 *
 * (Optionnel : BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD font pareil si tu préfères.)
 */
import "dotenv/config";
import { hash } from "bcryptjs";
import { Role } from "../src/generated/prisma";
import { getPrisma } from "../src/lib/prisma";

async function main() {
  const email =
    process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase() ||
    process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password =
    process.env.BOOTSTRAP_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(`
Manque email ou mot de passe dans web/.env. Ajoute par exemple :

  ADMIN_EMAIL="ton@email.com"
  ADMIN_PASSWORD="ton_mot_de_passe_au_moins_8_caracteres"

Puis relance : npm run bootstrap-admin
(Ensuite supprime la ligne ADMIN_PASSWORD.)
`);
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Mot de passe trop court (min. 8 caractères).");
    process.exit(1);
  }

  const prisma = getPrisma();
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      name: "Admin",
      role: Role.ADMIN,
    },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("OK — tu peux te connecter sur http://localhost:3000/login avec :", email);
  console.log("Supprime ADMIN_PASSWORD (ou BOOTSTRAP_ADMIN_PASSWORD) de ton .env maintenant.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
