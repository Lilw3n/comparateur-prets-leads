# 📖 Guide : Utilisation du Script `demarrer_streams_ffmpeg.py`

## 🎯 À Quoi Sert Ce Script ?

Ce script démarre **manuellement** tous les streams FFmpeg activés dans `streams.json`.

**Utile quand** :
- Les streams FFmpeg ne démarrent pas automatiquement
- Vous voulez forcer le démarrage sans passer par l'interface web
- Vous testez la configuration FFmpeg

---

## 🚀 Comment l'Utiliser ?

### Méthode 1 : Ligne de Commande

```powershell
# Dans le dossier du projet
python demarrer_streams_ffmpeg.py
```

**Résultat attendu** :
```
============================================================
DEMARRAGE DES STREAMS FFMPEG
============================================================
[OK] FFmpeg trouve: C:\...\ffmpeg\bin\ffmpeg.exe
[OK] 6 stream(s) active(s)
------------------------------------------------------------
[DEBUT] Demarrage de Facebook - SocialLIVE (ID: 1)...
[OK] Facebook - SocialLIVE (ID: 1): Relais demarre
...
```

### Méthode 2 : Double-clic (si configuré)

Vous pouvez créer un `.bat` pour exécuter facilement :

```batch
@echo off
cd /d "%~dp0"
python demarrer_streams_ffmpeg.py
pause
```

---

## ✅ Conditions Requises

**Pour que le script fonctionne, il faut** :

1. ✅ **FFmpeg installé** dans le projet (`ffmpeg\bin\ffmpeg.exe`)
2. ✅ **Nginx démarré** et écoute sur le port 1935
3. ✅ **OBS en train de streamer** vers `rtmp://[IP_LOCALE]:1935/live`
4. ✅ **Mode FFmpeg Proxy activé** dans `config.json`

**Si une condition manque** → Le script affichera une erreur.

---

## 📊 Ce Que Fait le Script

1. **Vérifie FFmpeg** → Trouve `ffmpeg.exe` dans le projet
2. **Charge les streams** → Lit `streams.json`
3. **Filtre les streams activés** → Sélectionne ceux avec `enabled: true`
4. **Démarre chaque relay FFmpeg** → Un processus par stream
5. **Affiche un résumé** → Nombre de streams démarrés avec succès

---

## 🔍 Vérification Après Exécution

### 1. Gestionnaire des Tâches

Ouvrez le **Gestionnaire des tâches** (Ctrl+Shift+Esc) :
- Recherchez **"ffmpeg.exe"**
- **Vous devriez voir** : Un processus par stream activé

**Exemple avec 6 streams activés** :
```
ffmpeg.exe (PID: 1234)
ffmpeg.exe (PID: 1235)
ffmpeg.exe (PID: 1236)
ffmpeg.exe (PID: 1237)
ffmpeg.exe (PID: 1238)
ffmpeg.exe (PID: 1239)
```

### 2. Interface Web

Dans l'interface web (http://localhost:5000) :
- Les streams devraient afficher **"Actif"**
- Le statut FFmpeg devrait être **"En cours d'exécution"**

### 3. Plateformes

Sur Facebook, TikTok, etc. :
- Les streams devraient être **"En direct"** (live)
- Vous devriez voir la vidéo en temps réel

---

## ⚠️ Erreurs Possibles

### Erreur 1 : "FFmpeg non trouvé"

```
[ERREUR] FFmpeg non trouve !
```

**Solution** :
- Vérifiez que `ffmpeg\bin\ffmpeg.exe` existe
- Ou configurez le chemin dans `config.json` : `"ffmpeg_path": "chemin/vers/ffmpeg.exe"`

---

### Erreur 2 : "Error opening input file"

```
[ERREUR] FFmpeg s'est arrêté immédiatement: Error opening input file rtmp://localhost:1935/live
```

**Causes** :
- **Nginx n'est pas démarré** → Démarrez Nginx via l'interface web
- **OBS ne stream pas** → Commencez à streamer dans OBS vers `rtmp://[IP_LOCALE]:1935/live`
- **Stream pas encore disponible** → Attendez 5-10 secondes après avoir démarré OBS

**Solution** :
1. Vérifiez que Nginx est démarré : `Get-Process -Name "nginx"`
2. Vérifiez que OBS stream (bouton "Arrêter le stream" visible)
3. Attendez quelques secondes
4. Relancez le script

---

### Erreur 3 : "Aucun stream activé"

```
[ATTENTION] Aucun stream active dans streams.json
```

**Solution** :
- Ouvrez `streams.json`
- Mettez `"enabled": true` pour au moins un stream
- Ou activez les streams via l'interface web

---

### Erreur 4 : "Mode FFmpeg Proxy non activé"

```
[ATTENTION] Le mode FFmpeg Proxy n'est pas active
```

**Solution** :
- Ouvrez `config.json`
- Mettez `"use_ffmpeg_proxy": true`
- Ou activez-le via l'interface web (Section "Mode")

---

## 🎯 Alternatives

### Via l'Interface Web

Au lieu du script, vous pouvez :

1. **Ouvrir l'interface web** : http://localhost:5000
2. **Section Nginx** → Cliquez **"Recharger"**
3. **Tous les streams activés** seront automatiquement démarrés

**Avantage** : Plus simple, interface visuelle

---

### Via l'API Directement

Vous pouvez aussi appeler l'API directement :

```powershell
# Démarrer un stream spécifique
Invoke-RestMethod -Uri "http://localhost:5000/api/streams/1" -Method PUT -Body '{"enabled":true}' -ContentType "application/json"

# Ou recharger tous les streams
Invoke-RestMethod -Uri "http://localhost:5000/api/reload" -Method POST
```

---

## 📝 Exemple Complet

```powershell
# 1. Vérifier que tout est prêt
Get-Process -Name "nginx"  # Nginx doit être démarré
Get-Process -Name "obs64"  # OBS doit être en train de streamer

# 2. Lancer le script
python demarrer_streams_ffmpeg.py

# 3. Vérifier les résultats
Get-Process -Name "ffmpeg"  # Devrait afficher plusieurs processus
```

---

## 🔄 Relancer les Streams

**Pour relancer tous les streams** :
- **Relancez simplement** : `python demarrer_streams_ffmpeg.py`
- Le script arrêtera automatiquement les anciens processus avant de démarrer les nouveaux

**Pour arrêter tous les streams** :
- Utilisez l'interface web pour désactiver les streams
- Ou arrêtez les processus FFmpeg via le Gestionnaire des tâches

---

## ✅ Résumé

**Commande principale** :
```powershell
python demarrer_streams_ffmpeg.py
```

**Conditions** :
- ✅ Nginx démarré
- ✅ OBS en train de streamer
- ✅ Mode FFmpeg Proxy activé

**Résultat** :
- ✅ Un processus FFmpeg par stream activé
- ✅ Streams visibles sur les plateformes



