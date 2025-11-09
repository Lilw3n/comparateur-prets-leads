# Guide de synchronisation automatique

## 📋 Vue d'ensemble

Ce système permet de synchroniser automatiquement vos fichiers locaux vers le serveur FTP à chaque modification.

## 🚀 Méthodes de synchronisation

### 1. Synchronisation manuelle

Exécutez simplement le script PowerShell :

```powershell
.\sync-to-ftp.ps1
```

Pour synchroniser un dossier spécifique :

```powershell
.\sync-to-ftp.ps1 -Path "wp-content/themes/lilwen54-child"
```

### 2. Synchronisation automatique après Git commit

Les hooks Git sont configurés pour synchroniser automatiquement après chaque commit :

- **post-commit** : Synchronise après chaque commit local
- **post-merge** : Synchronise après chaque pull/merge

### 3. Surveillance en temps réel

Pour une synchronisation continue, utilisez le script de surveillance :

```powershell
.\watch-and-sync.ps1
```

Ce script surveille les changements dans le dossier `wp-content/themes/lilwen54-child` et synchronise automatiquement toutes les 5 secondes.

## ⚙️ Configuration

### Modifier les paramètres FTP

Éditez le fichier `sync-to-ftp.ps1` et modifiez les variables en haut :

```powershell
$ftpServer = "chataigner.o2switch.net"
$ftpUser = "gopo4199"
$ftpPass = "votre_mot_de_passe"
$remoteBasePath = "/lilwen54.fr"
```

### Modifier l'intervalle de surveillance

Dans `watch-and-sync.ps1` :

```powershell
$IntervalSeconds = 5  # Changez cette valeur
```

## 📁 Fichiers ignorés

Les fichiers suivants ne sont **pas** synchronisés :

- `.git/` et `.gitignore`
- `node_modules/`
- `.vscode/`, `.idea/`
- `*.log`, `*.tmp`, `*.cache`

## 🔒 Sécurité

⚠️ **Important** : Le mot de passe FTP est stocké en clair dans le script. Pour plus de sécurité :

1. Utilisez des variables d'environnement
2. Utilisez un fichier de configuration séparé (non versionné)
3. Utilisez des identifiants avec permissions limitées

## 🛠️ Dépannage

### Le script ne s'exécute pas

Vérifiez la politique d'exécution PowerShell :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erreurs de connexion FTP

- Vérifiez que le serveur FTP est accessible
- Vérifiez les identifiants
- Vérifiez le pare-feu

### Les hooks Git ne fonctionnent pas

Sur Windows, les hooks Git peuvent nécessiter Git Bash ou WSL. Vous pouvez aussi exécuter manuellement :

```powershell
.\sync-to-ftp.ps1
```

## 📝 Exemples d'utilisation

### Synchroniser uniquement le thème enfant

```powershell
.\sync-to-ftp.ps1 -Path "wp-content/themes/lilwen54-child"
```

### Démarrer la surveillance en arrière-plan

```powershell
Start-Process powershell -ArgumentList "-File", "watch-and-sync.ps1" -WindowStyle Minimized
```

### Synchroniser après chaque modification

Lancez `watch-and-sync.ps1` dans un terminal séparé et laissez-le tourner pendant que vous travaillez.

## ✅ Vérification

Pour vérifier que la synchronisation fonctionne :

1. Modifiez un fichier dans `wp-content/themes/lilwen54-child/`
2. Exécutez `.\sync-to-ftp.ps1`
3. Vérifiez sur le serveur FTP que le fichier a été mis à jour

