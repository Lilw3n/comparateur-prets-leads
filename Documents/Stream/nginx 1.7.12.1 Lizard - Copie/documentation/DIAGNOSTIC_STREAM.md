# 🔍 Diagnostic : FFmpeg Ne Peut Pas Démarrer

## ❌ Erreur Rencontrée

```
Error opening input file rtmp://localhost:1935/live
could not find codec parameters
Unable to seek to the next packet
```

**Cela signifie** : FFmpeg ne peut pas se connecter à Nginx ou Nginx n'a pas de stream disponible.

---

## 🔍 Causes Possibles

### 1. **Nginx n'est pas démarré**

**Vérification** :
- Ouvrez le **Gestionnaire des tâches** (Ctrl+Shift+Esc)
- Recherchez **"nginx.exe"**
- **Si aucun processus** → Nginx n'est pas démarré

**Solution** :
1. Ouvrez l'interface web (http://localhost:5000)
2. Section **"Nginx"**
3. Cliquez sur **"Démarrer"**

---

### 2. **OBS n'envoie pas de stream vers Nginx**

**Vérification** :
- Dans **OBS Studio**, vérifiez que vous êtes **"En train de streamer"**
- Vérifiez l'**URL RTMP** dans OBS :
  - Doit être : `rtmp://192.168.1.28:1935/live` (ou votre IP locale)
  - **Pas** : `rtmp://localhost:1935/live` (OBS ne peut pas se connecter à localhost depuis une autre machine)

**Solution** :
1. **Dans OBS**, allez dans **Paramètres** → **Stream**
2. **Service** : Personnalisé
3. **Serveur** : `rtmp://192.168.1.28:1935/live` (remplacez par votre IP locale)
4. **Cliquez "Commencer le stream"**

---

### 3. **Nginx n'écoute pas sur le port 1935**

**Vérification** :
```powershell
netstat -ano | Select-String ":1935"
```

**Résultat attendu** :
```
TCP    0.0.0.0:1935           0.0.0.0:0              LISTENING       XXXX
```

**Si rien n'apparaît** :
- Nginx n'est pas démarré
- Ou Nginx écoute sur un autre port

**Solution** :
- Vérifiez `conf/nginx.conf` → `listen 1935;`
- Redémarrez Nginx

---

### 4. **Le stream n'est pas encore disponible**

**Causes** :
- OBS vient de commencer à streamer
- Nginx a besoin de quelques secondes pour rendre le stream accessible

**Solution** :
- **Attendez 5-10 secondes** après avoir démarré OBS
- **Relancez** `python demarrer_streams_ffmpeg.py`

---

## ✅ Solution Étape par Étape

### Étape 1 : Vérifier Nginx

```powershell
# Vérifier que Nginx est démarré
Get-Process -Name "nginx" -ErrorAction SilentlyContinue
```

**Si aucun processus** :
- Démarrez Nginx via l'interface web
- Ou manuellement : `nginx.exe` dans le dossier du projet

---

### Étape 2 : Vérifier que Nginx écoute sur 1935

```powershell
netstat -ano | Select-String ":1935"
```

**Si rien** :
- Nginx n'est pas démarré ou écoute sur un autre port
- Vérifiez `conf/nginx.conf`

---

### Étape 3 : Vérifier OBS

**Dans OBS Studio** :
1. **Paramètres** → **Stream**
2. **Serveur** : `rtmp://192.168.1.28:1935/live` (votre IP locale)
3. **Cliquez "Commencer le stream"**
4. **Attendez** que le stream soit actif (bouton "Arrêter le stream" visible)

---

### Étape 4 : Tester la connexion FFmpeg

```powershell
# Test manuel de connexion
ffmpeg\bin\ffmpeg.exe -i "rtmp://localhost:1935/live" -c copy -f null - -t 5
```

**Si ça fonctionne** :
- FFmpeg peut lire depuis Nginx
- Le problème était que OBS ne streamait pas encore

**Si erreur** :
- Nginx n'est pas démarré
- Ou OBS ne stream pas encore

---

### Étape 5 : Démarrer les Streams FFmpeg

Une fois que :
- ✅ Nginx est démarré
- ✅ OBS stream vers Nginx
- ✅ FFmpeg peut lire depuis `rtmp://localhost:1935/live`

**Alors** :
```powershell
python demarrer_streams_ffmpeg.py
```

---

## 🎯 Ordre Correct de Démarrage

1. **Démarrer Nginx** (via interface web ou `nginx.exe`)
2. **Démarrer OBS** et **commencer à streamer** vers `rtmp://[IP_LOCALE]:1935/live`
3. **Attendre 5-10 secondes** que le stream soit disponible
4. **Démarrer les streams FFmpeg** (via interface web "Recharger" ou script)

**IMPORTANT** : FFmpeg ne peut pas démarrer si OBS ne stream pas encore !

---

## 🔍 Vérification Rapide

**Checklist** :
- [ ] Nginx est démarré (visible dans Gestionnaire des tâches)
- [ ] Nginx écoute sur le port 1935 (`netstat -ano | findstr :1935`)
- [ ] OBS est en train de streamer (bouton "Arrêter le stream" visible)
- [ ] OBS envoie vers `rtmp://[IP_LOCALE]:1935/live`
- [ ] Attendu 5-10 secondes après démarrage OBS

**Si tous les points sont OK** → Les streams FFmpeg devraient démarrer !



