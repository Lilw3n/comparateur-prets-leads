# 🚀 Instructions pour Push et Déploiement Vercel

## ✅ État Actuel

Tous vos fichiers sont **commités** et prêts à être poussés !

**Derniers commits :**
- ✅ Guide de démarrage rapide Vercel
- ✅ Script de déploiement
- ✅ Configuration PostgreSQL et Vercel
- ✅ Comparateur de prêts complet avec API bancaires

## ⚠️ Action Requise : Configurer le Remote Git

Le remote actuel pointe vers un autre repository. Vous devez créer un nouveau repo GitHub.

### Option 1 : Créer un Nouveau Repository GitHub

1. **Allez sur** https://github.com/new
2. **Nom du repo** : `comparateur-prets` (ou autre nom)
3. **Visibilité** : Public ou Private
4. **NE PAS** cocher "Initialize with README"
5. **Cliquez** "Create repository"

### Option 2 : Utiliser le Script Automatique

```powershell
cd "F:\Cursor Sites\Leads"
.\push-to-github.ps1
```

Le script vous guidera pour configurer le remote et push.

### Option 3 : Configuration Manuelle

```bash
cd "F:\Cursor Sites\Leads"

# Remplacer par votre URL GitHub
git remote set-url origin https://github.com/VOTRE_USERNAME/comparateur-prets.git

# Push vers GitHub
git push -u origin main
```

## 🌐 Déploiement sur Vercel

### Méthode 1 : Via l'Interface Web (Recommandé)

1. **Allez sur** https://vercel.com
2. **Connectez** votre compte GitHub
3. **Cliquez** "Add New Project"
4. **Sélectionnez** votre repository `comparateur-prets`
5. **Configurez** :
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: npm run build
   Output Directory: frontend/dist
   Install Command: npm run install:all
   ```
6. **Ajoutez** les variables d'environnement (voir ci-dessous)
7. **Cliquez** "Deploy"

### Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Dans le dossier du projet
cd "F:\Cursor Sites\Leads"
vercel

# Pour la production
vercel --prod
```

## 🔐 Variables d'Environnement Vercel

Dans **Vercel Dashboard > Settings > Environment Variables**, ajoutez :

```
DATABASE_URL=postgresql://user:password@host:5432/database
PORT=3002
NODE_ENV=production
ENABLE_REAL_BANKING_APIS=false
```

**Pour obtenir DATABASE_URL :**
- Option 1 : Vercel Postgres (Dashboard > Storage > Create Database)
- Option 2 : Supabase, Railway, ou autre provider PostgreSQL

## 📊 Migration Base de Données

**⚠️ IMPORTANT** : Vercel ne supporte pas SQLite. Utilisez PostgreSQL :

1. **Copier le schema PostgreSQL** :
   ```bash
   cd "F:\Cursor Sites\Leads"
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   ```

2. **Ou modifier manuellement** `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"  // Au lieu de "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Commit et push** :
   ```bash
   git add prisma/schema.prisma
   git commit -m "chore: Migration vers PostgreSQL pour production"
   git push origin main
   ```

4. **Migrations sur Vercel** :
   - Ajoutez dans Vercel Dashboard > Settings > Build & Development Settings :
   - **Build Command** : `npm run build && cd backend && npx prisma migrate deploy --schema=../prisma/schema.prisma && npx prisma generate --schema=../prisma/schema.prisma`

## ✅ Vérification

Après déploiement, testez :

- **Frontend** : `https://votre-projet.vercel.app`
- **API Health** : `https://votre-projet.vercel.app/api/health`
- **API Leads** : `https://votre-projet.vercel.app/api/leads`

## 📚 Documentation

- **Guide complet** : `DEPLOIEMENT_VERCEL.md`
- **Démarrage rapide** : `QUICK_START_VERCEL.md`
- **API bancaires** : `README_API_BANKING.md`

## 🆘 Dépannage

### Erreur de build
- Vérifiez les logs dans Vercel Dashboard
- Vérifiez que `DATABASE_URL` est configurée
- Vérifiez que PostgreSQL est utilisé (pas SQLite)

### Erreur CORS
- Les headers sont configurés dans `vercel.json`
- Vérifiez que le frontend pointe vers la bonne URL

### Erreur de base de données
- Vérifiez la connexion PostgreSQL
- Vérifiez que les migrations sont exécutées
- Vérifiez les logs Prisma dans Vercel

## 🎉 C'est Prêt !

Votre projet est maintenant prêt à être déployé sur Vercel !
