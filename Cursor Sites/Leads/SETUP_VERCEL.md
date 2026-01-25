# 🚀 Guide de Déploiement sur Vercel

## Étape 1 : Créer un Repository GitHub

1. Allez sur https://github.com/new
2. Créez un nouveau repository nommé `comparateur-prets` (ou autre nom)
3. **Ne pas** initialiser avec README, .gitignore ou licence

## Étape 2 : Configurer Git Remote

```bash
cd "F:\Cursor Sites\Leads"

# Vérifier le remote actuel
git remote -v

# Si besoin, changer le remote vers votre nouveau repo
git remote set-url origin https://github.com/VOTRE_USERNAME/comparateur-prets.git

# Ou ajouter un nouveau remote
git remote add origin https://github.com/VOTRE_USERNAME/comparateur-prets.git
```

## Étape 3 : Push vers GitHub

```bash
# Push vers GitHub
git push -u origin main

# Si erreur de branche, essayer :
git push -u origin main --force
```

## Étape 4 : Déployer sur Vercel

### Option A : Via l'interface Vercel (Recommandé)

1. Allez sur https://vercel.com
2. Cliquez sur **"Add New Project"**
3. Importez votre repository GitHub `comparateur-prets`
4. Configurez le projet :
   - **Framework Preset** : Other
   - **Root Directory** : `./` (racine)
   - **Build Command** : `npm run build`
   - **Output Directory** : `frontend/dist`
   - **Install Command** : `npm run install:all`

### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Dans le dossier du projet
cd "F:\Cursor Sites\Leads"
vercel

# Suivre les instructions
# Pour la production :
vercel --prod
```

## Étape 5 : Variables d'Environnement

Dans Vercel Dashboard > Settings > Environment Variables, ajoutez :

```
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=3002
ENABLE_REAL_BANKING_APIS=false
NODE_ENV=production
```

## Étape 6 : Base de Données PostgreSQL

Vercel ne supporte pas SQLite. Vous devez utiliser PostgreSQL :

1. **Option 1 : Vercel Postgres** (Recommandé)
   - Dans Vercel Dashboard > Storage > Create Database
   - Choisissez PostgreSQL
   - Copiez la `DATABASE_URL` dans les variables d'environnement

2. **Option 2 : Autre provider** (Supabase, Railway, etc.)
   - Créez une base PostgreSQL
   - Ajoutez la `DATABASE_URL` dans Vercel

3. **Migrations Prisma**
   ```bash
   # Après avoir configuré DATABASE_URL
   cd backend
   npx prisma migrate deploy --schema=../prisma/schema.prisma
   ```

## ⚠️ Important : Modifier schema.prisma pour PostgreSQL

Avant de déployer, modifiez `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"  // Au lieu de "sqlite"
  url      = env("DATABASE_URL")
}
```

## ✅ Vérification

Une fois déployé, votre site sera accessible sur :
- URL de production : `https://votre-projet.vercel.app`
- URL de preview : `https://votre-projet-git-branch.vercel.app`

## 🔧 Configuration Avancée

Le fichier `vercel.json` est déjà configuré avec :
- Routes API vers `/api/*`
- Routes frontend vers les fichiers statiques
- Headers CORS
- Configuration de build

## 📝 Notes

- Les fichiers `.env` ne sont **jamais** commités (dans .gitignore)
- Configurez toutes les variables dans Vercel Dashboard
- Le build frontend génère les fichiers dans `frontend/dist`
- Le backend fonctionne comme fonction serverless sur Vercel
