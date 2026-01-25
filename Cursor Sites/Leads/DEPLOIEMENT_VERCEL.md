# Guide de Déploiement sur Vercel

## 📋 Prérequis

1. Compte Vercel (gratuit) : https://vercel.com
2. Compte GitHub/GitLab/Bitbucket (pour le repository)
3. Node.js installé localement

## 🚀 Étapes de Déploiement

### 1. Préparer le Repository Git

```bash
# Vérifier l'état
git status

# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "feat: Ajout de toutes les fonctionnalités - Comparateur de prêts complet avec API bancaires"

# Vérifier le remote
git remote -v

# Si pas de remote, ajouter votre repository GitHub
# git remote add origin https://github.com/votre-username/votre-repo.git

# Push vers GitHub
git push origin main
```

### 2. Configuration Vercel

#### Option A : Via l'interface Vercel (Recommandé)

1. Allez sur https://vercel.com
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Configurez le projet :
   - **Framework Preset** : Other
   - **Root Directory** : `./` (racine du projet)
   - **Build Command** : `npm run build`
   - **Output Directory** : `frontend/dist`
   - **Install Command** : `npm run install:all`

#### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

### 3. Variables d'Environnement sur Vercel

Dans le dashboard Vercel, allez dans Settings > Environment Variables et ajoutez :

```
DATABASE_URL=votre_url_postgresql_vercel
PORT=3002
ENABLE_REAL_BANKING_APIS=false
TINK_API_KEY=votre_cle_tink (optionnel)
BRIDGE_API_KEY=votre_cle_bridge (optionnel)
OPEN_CREDITS_API_KEY=votre_cle_opencrédits (optionnel)
```

### 4. Configuration de la Base de Données

Pour la production, vous devez utiliser PostgreSQL :

1. Créez une base de données PostgreSQL sur Vercel Postgres ou un autre provider
2. Mettez à jour `DATABASE_URL` dans les variables d'environnement
3. Modifiez `prisma/schema.prisma` pour utiliser PostgreSQL :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. Exécutez les migrations :

```bash
cd backend
npx prisma migrate deploy --schema=../prisma/schema.prisma
```

### 5. Build Configuration

Le fichier `vercel.json` est déjà configuré avec :
- Routes API vers le backend
- Routes frontend vers les fichiers statiques
- Headers CORS pour les API
- Configuration de build

## 🔧 Configuration Avancée

### Monorepo Setup

Vercel détecte automatiquement le monorepo grâce à `package.json` avec workspaces.

### Backend API Routes

Les routes API sont automatiquement routées vers `backend/src/server.ts` via la configuration dans `vercel.json`.

### Frontend Static Files

Le frontend est servi depuis `frontend/dist` après le build.

## 📝 Notes Importantes

1. **Base de données** : SQLite ne fonctionne pas sur Vercel. Utilisez PostgreSQL en production.

2. **Variables d'environnement** : 
   - Ne commitez JAMAIS les fichiers `.env`
   - Configurez-les dans le dashboard Vercel

3. **Build** : 
   - Le build frontend génère les fichiers statiques dans `frontend/dist`
   - Le backend doit être configuré comme fonction serverless

4. **CORS** : 
   - Les headers CORS sont configurés dans `vercel.json`
   - Assurez-vous que votre frontend pointe vers l'URL Vercel en production

## 🐛 Dépannage

### Erreur de build

```bash
# Vérifier les logs dans Vercel Dashboard
# Vérifier que toutes les dépendances sont dans package.json
npm run install:all
```

### Erreur de base de données

```bash
# Vérifier la connexion PostgreSQL
# Vérifier les migrations Prisma
npx prisma migrate deploy
```

### Erreur CORS

- Vérifier les headers dans `vercel.json`
- Vérifier l'URL du frontend dans les variables d'environnement

## 🔗 Liens Utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Deploying Node.js](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
