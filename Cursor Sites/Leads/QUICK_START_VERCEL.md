# ⚡ Déploiement Rapide sur Vercel

## 🎯 Résumé

Votre projet est prêt à être déployé ! Tous les fichiers sont commités dans Git.

## 📋 Étapes Rapides

### 1. Créer un Repository GitHub

```bash
# Allez sur https://github.com/new
# Créez un repo nommé "comparateur-prets"
# Ne cochez PAS "Initialize with README"
```

### 2. Configurer Git et Push

```bash
cd "F:\Cursor Sites\Leads"

# Option A : Utiliser le script PowerShell
.\push-to-github.ps1

# Option B : Manuellement
git remote set-url origin https://github.com/VOTRE_USERNAME/comparateur-prets.git
git push -u origin main
```

### 3. Déployer sur Vercel

#### Via l'interface web (Recommandé) :

1. **Allez sur** https://vercel.com
2. **Cliquez** "Add New Project"
3. **Importez** votre repository GitHub
4. **Configurez** :
   - Framework: **Other**
   - Root Directory: **./** (racine)
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run install:all`

#### Via CLI :

```bash
npm i -g vercel
vercel login
cd "F:\Cursor Sites\Leads"
vercel
vercel --prod
```

### 4. Variables d'Environnement Vercel

Dans **Vercel Dashboard > Settings > Environment Variables** :

```
DATABASE_URL=postgresql://user:pass@host:5432/db
PORT=3002
NODE_ENV=production
ENABLE_REAL_BANKING_APIS=false
```

### 5. Base de Données PostgreSQL

**⚠️ IMPORTANT** : Vercel ne supporte pas SQLite. Utilisez PostgreSQL :

1. **Vercel Postgres** (Recommandé) :
   - Dashboard Vercel > Storage > Create Database
   - Choisissez PostgreSQL
   - Copiez la `DATABASE_URL`

2. **Modifier schema.prisma** :
   ```bash
   # Copier le schema PostgreSQL
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   
   # Ou modifier manuellement :
   # datasource db { provider = "postgresql" }
   ```

3. **Migrations** :
   ```bash
   cd backend
   npx prisma migrate deploy --schema=../prisma/schema.prisma
   npx prisma generate --schema=../prisma/schema.prisma
   ```

## ✅ Vérification

Après déploiement :
- **Frontend** : `https://votre-projet.vercel.app`
- **API** : `https://votre-projet.vercel.app/api/health`

## 📁 Fichiers de Configuration

- ✅ `vercel.json` - Configuration Vercel
- ✅ `.vercelignore` - Fichiers ignorés
- ✅ `prisma/schema.postgresql.prisma` - Schema pour production
- ✅ `DEPLOIEMENT_VERCEL.md` - Guide détaillé
- ✅ `SETUP_VERCEL.md` - Instructions complètes

## 🚀 Commandes Utiles

```bash
# Vérifier l'état Git
git status

# Voir les commits
git log --oneline -5

# Push vers GitHub
git push origin main

# Déployer sur Vercel
vercel --prod

# Voir les logs Vercel
vercel logs
```

## 🆘 Support

- Documentation Vercel : https://vercel.com/docs
- Vercel Postgres : https://vercel.com/docs/storage/vercel-postgres
- Prisma avec PostgreSQL : https://www.prisma.io/docs/concepts/database-connectors/postgresql
