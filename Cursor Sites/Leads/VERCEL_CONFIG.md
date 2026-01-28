# Configuration Vercel pour Comparateur de Prêts

## 📋 Configuration actuelle

Le projet est configuré pour être déployé sur Vercel avec :
- **Frontend** : Application React/Vite dans `frontend/`
- **Backend** : API Express.js compilée en serverless functions dans `api/`

## 🔧 Fichiers de configuration

### `vercel.json`
- **Build Command** : `npm run build:backend && npm run build:frontend`
- **Output Directory** : `frontend/dist`
- **Functions** : `api/index.js` utilise le runtime `@vercel/node`
- **Rewrites** : Toutes les routes `/api/*` sont redirigées vers `/api/index.js`

### `api/index.js`
Point d'entrée serverless function qui :
- Importe toutes les routes compilées du backend
- Configure CORS et middleware Express
- Gère les routes : `/api/leads`, `/api/comparateurs`, `/api/articles`, `/api/dossiers`

## 🚀 Déploiement

### Prérequis
1. Le projet doit être connecté à un dépôt Git (GitHub, GitLab, Bitbucket)
2. Les variables d'environnement doivent être configurées dans Vercel :
   - `DATABASE_URL` : URL de connexion à la base de données PostgreSQL

### Étapes de déploiement

1. **Connecter le dépôt Git** :
   - Aller sur https://vercel.com/lilw3ns-projects/comparateur-prets/settings/git
   - Connecter votre dépôt GitHub

2. **Configurer les variables d'environnement** :
   - Dans Vercel Dashboard → Settings → Environment Variables
   - Ajouter `DATABASE_URL` avec votre URL PostgreSQL

3. **Build automatique** :
   - Vercel détectera automatiquement `vercel.json`
   - Le build compilera le backend TypeScript puis le frontend
   - Les routes API seront disponibles via `/api/*`

## 📝 Notes importantes

### Base de données
- **Développement** : SQLite (`backend/dev.db`)
- **Production** : PostgreSQL (configuré via `DATABASE_URL`)

### Prisma
- Prisma Client est généré automatiquement avant le build backend
- Les migrations doivent être appliquées manuellement sur la base de données de production

### Routes API disponibles
- `GET /api/health` - Health check
- `GET /api/leads` - Liste des leads
- `POST /api/leads` - Créer un lead
- `GET /api/comparateurs` - Liste des comparateurs
- `POST /api/comparer` - Comparer des prêts
- `GET /api/articles` - Liste des articles
- `GET /api/dossiers` - Liste des dossiers
- Et toutes les autres routes définies dans `backend/src/routes/`

## 🔍 Dépannage

### Erreur "Routes not fully loaded"
- Vérifier que le backend est bien compilé (`npm run build:backend`)
- Vérifier que les fichiers dans `backend/dist/routes/` existent

### Erreur de connexion à la base de données
- Vérifier que `DATABASE_URL` est correctement configurée dans Vercel
- Vérifier que la base de données PostgreSQL est accessible depuis Vercel
- Appliquer les migrations Prisma : `npx prisma migrate deploy`

### Erreur de build
- Vérifier que toutes les dépendances sont installées (`npm run install:all`)
- Vérifier que Prisma Client est généré (`npm run prisma:generate`)

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Prisma avec Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
