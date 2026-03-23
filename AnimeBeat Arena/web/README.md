# AnimeBeat Arena (web)

## Démarrage simple (SQLite, sans PostgreSQL)

1. `cp .env.example .env` puis renseigne au minimum `AUTH_SECRET` (chaîne longue aléatoire).
2. `DATABASE_URL="file:./prisma/dev.db"` (déjà dans l’exemple).
3. Créer la base + compte admin :
   ```bash
   npx prisma db push
   npm run bootstrap-admin
   ```
   (Le script lit `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` ou `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `.env`.)
4. `AUTH_URL` doit être **exactement** l’URL du site (ex. `http://localhost:3000`).
5. Lancer :
   ```bash
   npm run dev
   ```
6. Ouvre [http://localhost:3000/login](http://localhost:3000/login) avec l’email et le mot de passe du bootstrap.

**Un seul** `npm run dev` à la fois pour éviter le passage sur le port 3001.

**Production (Vercel)** : utiliser PostgreSQL (Neon, etc.), remettre `provider = "postgresql"` dans `prisma/schema.prisma` et adapter la connexion selon la doc Prisma 7.

---

Next.js + Auth.js + Prisma. Police : [Geist](https://vercel.com/font).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
