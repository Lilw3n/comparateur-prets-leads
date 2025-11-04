# 🔍 Comment Vérifier que FFmpeg Fonctionne

## ✅ Méthodes de Vérification

### 1. Gestionnaire des Tâches

1. **Ouvrez le Gestionnaire des tâches** (Ctrl+Shift+Esc)
2. **Recherchez "ffmpeg.exe"**
3. **Vous devriez voir** :
   - **Un processus FFmpeg par stream activé**
   - **Exemple avec 6 streams activés** : 6 processus `ffmpeg.exe`

**Si vous ne voyez aucun FFmpeg** :
- Les streams ne sont peut-être pas activés dans l'interface
- FFmpeg n'a peut-être pas démarré (erreur de connexion)
- Utilisez "Recharger" dans l'interface pour démarrer les streams

---

### 2. Interface Web

Dans l'interface web (http://localhost:5000) :
- **Regardez les cartes des streams**
- **Vérifiez le statut** : "Actif" ou "Inactif"
- **En mode FFmpeg Proxy**, vous devriez voir un indicateur pour chaque stream

---

### 3. Vérification Technique (Ligne de Commande)

```powershell
# Compter les processus FFmpeg actifs
Get-Process -Name "ffmpeg" -ErrorAction SilentlyContinue | Measure-Object | Select-Object Count

# Voir les détails des processus FFmpeg
Get-Process -Name "ffmpeg" -ErrorAction SilentlyContinue | Select-Object Id, StartTime, CPU
```

**Résultat attendu** :
- **Nombre = Nombre de streams activés** dans `streams.json` avec `enabled: true`

---

### 4. Vérification des Lignes de Commande

Chaque processus FFmpeg a une ligne de commande avec un `STREAM_ID` unique :

```powershell
# Voir les lignes de commande des processus FFmpeg
Get-CimInstance Win32_Process -Filter "Name='ffmpeg.exe'" | Select-Object ProcessId, CommandLine
```

**Vous devriez voir** :
- `STREAM_ID:1` pour le stream avec `id: "1"`
- `STREAM_ID:2` pour le stream avec `id: "2"`
- etc.

---

### 5. Vérification sur les Plateformes

**Sur Facebook, TikTok, etc.** :
- **Connectez-vous** à votre compte créateur
- **Vérifiez** que le stream est **"En direct"** (live)
- **Vérifiez** que vous voyez la vidéo en temps réel

**Si le stream n'est pas visible** :
- FFmpeg peut être démarré mais ne pas réussir à se connecter
- Vérifiez les URLs dans `streams.json`
- Vérifiez que Stunnel est démarré (pour Facebook)

---

## 🔧 Dépannage

### Problème : Aucun FFmpeg visible

**Solutions** :
1. **Redémarrez Nginx** → Les streams FFmpeg démarreront automatiquement
2. **Utilisez "Recharger"** dans l'interface → Synchronise les streams
3. **Vérifiez que FFmpeg est trouvé** → Section "Mode" dans l'interface

### Problème : FFmpeg démarre puis s'arrête

**Causes possibles** :
- **Nginx n'est pas démarré** → FFmpeg ne peut pas lire `rtmp://localhost:1935/live`
- **OBS n'envoie pas de stream** → FFmpeg n'a rien à relayer
- **URL de destination incorrecte** → FFmpeg ne peut pas se connecter

**Solutions** :
1. **Vérifiez que Nginx est démarré** (section Nginx dans l'interface)
2. **Vérifiez que OBS stream** (OBS doit être en train de streamer)
3. **Vérifiez les URLs** dans `streams.json`

### Problème : FFmpeg visible mais stream pas actif sur la plateforme

**Causes possibles** :
- **Stunnel n'est pas démarré** (pour Facebook)
- **URL de destination expirée** (pour TikTok notamment)
- **Problème réseau** (connexion vers la plateforme)

**Solutions** :
1. **Vérifiez que Stunnel est démarré** (pour Facebook)
2. **Vérifiez les URLs** dans l'interface web
3. **Testez la connexion réseau** vers les plateformes

---

## 📊 Résumé

**FFmpeg fonctionne correctement si** :
- ✅ **Un processus FFmpeg par stream activé** dans le Gestionnaire des tâches
- ✅ **Les streams sont visibles** sur les plateformes (Facebook, TikTok, etc.)
- ✅ **Pas d'erreurs** dans l'interface web

**Si un de ces points manque** → Utilisez "Recharger" ou "Redémarrer Nginx" pour relancer les streams FFmpeg.



