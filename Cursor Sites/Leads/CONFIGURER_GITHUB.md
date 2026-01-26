# 🔗 Configuration du Repository GitHub

## État Actuel

❌ **Non connecté** - Le remote Git pointe vers un autre repository (`Lilwen54`)

## 📋 Étapes pour Connecter le Repository

### Option 1 : Via GitHub CLI (Recommandé)

1. **Authentifiez-vous avec GitHub CLI** :
   ```powershell
   gh auth login --web
   ```
   - Suivez les instructions dans le navigateur
   - Utilisez le code fourni (ex: `8FBD-C9DE`)

2. **Créez le repository** :
   ```powershell
   gh repo create comparateur-prets --public --description "Plateforme de comparaison de prêts immobiliers" --source=. --push
   ```

3. **Configurez le remote** :
   ```powershell
   git remote set-url origin https://github.com/Lilw3n/comparateur-prets.git
   ```

### Option 2 : Via l'Interface GitHub (Manuel)

1. **Créez le repository sur GitHub** :
   - Allez sur https://github.com/new
   - Nom : `comparateur-prets`
   - Description : `Plateforme de comparaison de prêts immobiliers`
   - Public
   - **Ne cochez PAS** "Initialize with README"
   - Cliquez sur "Create repository"

2. **Supprimez le lock Git** (si nécessaire) :
   ```powershell
   Remove-Item -Path "F:\.git\index.lock" -Force -ErrorAction SilentlyContinue
   ```

3. **Ajoutez tous les fichiers** :
   ```powershell
   cd "F:\Cursor Sites\Leads"
   git add .
   git commit -m "feat: Déploiement initial sur Vercel"
   ```

4. **Configurez le remote** :
   ```powershell
   git remote set-url origin https://github.com/Lilw3n/comparateur-prets.git
   ```

5. **Push vers GitHub** :
   ```powershell
   git push -u origin main
   ```

### Option 3 : Utiliser le Script Automatique

Exécutez le script PowerShell créé :

```powershell
cd "F:\Cursor Sites\Leads"
.\setup-github-repo.ps1
```

## 🔧 Résolution du Problème de Lock Git

Si vous voyez l'erreur `Unable to create 'F:/.git/index.lock'` :

1. **Fermez tous les processus Git** (Git GUI, VS Code, etc.)
2. **Supprimez le fichier lock** :
   ```powershell
   Remove-Item -Path "F:\.git\index.lock" -Force
   ```
3. **Réessayez les commandes Git**

## ✅ Vérification

Après configuration, vérifiez avec :

```powershell
git remote -v
```

Vous devriez voir :
```
origin  https://github.com/Lilw3n/comparateur-prets.git (fetch)
origin  https://github.com/Lilw3n/comparateur-prets.git (push)
```

## 🔗 Intégration avec Vercel

Une fois le repo GitHub créé :

1. Allez sur https://vercel.com/lilw3ns-projects/comparateur-prets
2. **Settings** > **Git**
3. Connectez votre repository GitHub
4. Les futurs commits seront automatiquement déployés

## 📝 Commandes Utiles

```powershell
# Voir l'état Git
git status

# Voir les remotes
git remote -v

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "votre message"

# Push
git push -u origin main

# Voir les commits
git log --oneline -10
```

## 🎯 Prochaines Étapes

1. ✅ Créer le repository GitHub
2. ✅ Push le code
3. ✅ Connecter Vercel au repo GitHub (déploiements automatiques)
4. ⚠️ Configurer PostgreSQL (voir `DEPLOIEMENT_REUSSI.md`)
