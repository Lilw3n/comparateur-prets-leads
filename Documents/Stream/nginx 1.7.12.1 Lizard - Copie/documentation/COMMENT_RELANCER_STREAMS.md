# 🔄 Comment Relancer les Streams

## 🎯 Méthodes pour Relancer les Streams

### Méthode 1 : Via l'Interface Web (La Plus Simple) ⭐

1. **Ouvrez l'interface web** : http://localhost:5000
2. **Section Nginx** → Cliquez sur **"Recharger"**
   - Cela va automatiquement redémarrer tous les streams activés
   - Message attendu : `"Synchronisation FFmpeg: X stream(s) démarré(s)"`

**OU**

3. **Section Nginx** → Cliquez sur **"Redémarrer"**
   - Arrête puis redémarre Nginx
   - Redémarre automatiquement tous les streams activés après

---

### Méthode 2 : Via le Script Python

```powershell
# Dans le dossier du projet
python demarrer_streams_ffmpeg.py
```

Ce script :
- Arrête tous les anciens processus FFmpeg
- Redémarre tous les streams activés dans `streams.json`

---

### Méthode 3 : Activer/Désactiver un Stream Spécifique

1. **Dans l'interface web**, trouvez le stream concerné
2. **Désactivez-le** (toggle OFF)
3. **Attendez 2 secondes**
4. **Réactivez-le** (toggle ON)

Le stream sera automatiquement redémarré.

---

### Méthode 4 : Via l'API (Avancé)

```powershell
# Relancer tous les streams
Invoke-RestMethod -Uri "http://localhost:5000/api/reload" -Method POST

# Ou activer/désactiver un stream spécifique
Invoke-RestMethod -Uri "http://localhost:5000/api/streams/1" -Method PUT -Body '{"enabled":false}' -ContentType "application/json"
Invoke-RestMethod -Uri "http://localhost:5000/api/streams/1" -Method PUT -Body '{"enabled":true}' -ContentType "application/json"
```

---

## ✅ Vérification

Après avoir relancé, vérifiez que ça fonctionne :

### 1. Gestionnaire des Tâches

```powershell
Get-Process -Name "ffmpeg" -ErrorAction SilentlyContinue
```

**Vous devriez voir** : Un processus `ffmpeg.exe` par stream activé

### 2. Interface Web

- Les streams devraient afficher **"Actif"**
- Le statut FFmpeg devrait être **"En cours d'exécution"**

### 3. Plateformes

- Connectez-vous à Facebook, TikTok, etc.
- Vérifiez que le stream est **"En direct"** (live)

---

## 🔍 Si les Streams ne Redémarrent Pas

### Problème 1 : OBS ne Stream Pas

**Vérification** :
- Dans OBS, vérifiez que vous êtes **"En train de streamer"**
- Vérifiez l'URL RTMP dans OBS : `rtmp://[IP_LOCALE]:1935/live`

**Solution** : Commencez à streamer dans OBS vers Nginx

---

### Problème 2 : Nginx N'est Pas Démarré

**Vérification** :
```powershell
Get-Process -Name "nginx" -ErrorAction SilentlyContinue
```

**Solution** : 
- Interface web → Section Nginx → **"Démarrer"**

---

### Problème 3 : Processus FFmpeg Orphelins

**Vérification** :
```powershell
Get-Process -Name "ffmpeg" -ErrorAction SilentlyContinue | Select-Object Id, CPU
```

**Solution** :
```powershell
# Arrêter tous les processus FFmpeg
Get-Process -Name "ffmpeg" -ErrorAction SilentlyContinue | Stop-Process -Force

# Puis relancer
python demarrer_streams_ffmpeg.py
```

---

## 📝 Ordre Recommandé

1. ✅ **Vérifier que OBS stream** vers Nginx
2. ✅ **Vérifier que Nginx est démarré**
3. ✅ **Utiliser "Recharger"** dans l'interface web
4. ✅ **Vérifier** dans le Gestionnaire des tâches

---

## 🎯 Résumé Rapide

**La méthode la plus simple** :
1. Interface web → Section Nginx → **"Recharger"**
2. C'est tout ! Les streams seront automatiquement redémarrés

**Si ça ne marche pas** :
1. Vérifiez OBS (doit streamer)
2. Vérifiez Nginx (doit être démarré)
3. Utilisez **"Redémarrer"** au lieu de "Recharger"



