# 🔄 Fonctionnement FFmpeg en Temps Réel

## 🎬 Scénario : OBS et les Flux sont Ouverts

Quand **OBS stream** et que les **flux sont activés** dans l'interface, voici comment FFmpeg fonctionne :

---

## 📊 Architecture Complète

```
┌─────────────────────────────────────────────────────────────┐
│  OBS Studio (en train de streamer)                          │
│  - Encode le stream avec son FFmpeg interne                │
│  - Envoie vers: rtmp://192.168.1.28:1935/live              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓ (Stream RTMP)
┌─────────────────────────────────────────────────────────────┐
│  Nginx RTMP Server (Port 1935)                               │
│  - Reçoit le stream d'OBS                                    │
│  - Application: /live                                        │
│  - Écoute sur: localhost:1935                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓ (Un seul stream reçu)
┌─────────────────────────────────────────────────────────────┐
│  FFmpeg Proxy (Notre gestionnaire)                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │ FFmpeg #1  │  │ FFmpeg #2  │  │ FFmpeg #3  │  ...        │
│  │ (Facebook) │  │  (TikTok)  │  │ (OneStream)│             │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘             │
│         │               │               │                    │
└─────────┼───────────────┼───────────────┼────────────────────┘
          │               │               │
          ↓               ↓               ↓
┌─────────┴──────┐  ┌─────┴──────┐  ┌─────┴──────────┐
│   Facebook     │  │   TikTok   │  │   OneStream   │
│   (via Stunnel)│  │  (Direct)   │  │   (Direct)    │
└────────────────┘  └────────────┘  └────────────────┘
```

---

## 🔍 Fonctionnement Détaillé

### Étape 1 : OBS Envoie le Stream

**OBS Studio :**
- Capture la vidéo/audio de vos sources
- **Encode avec son FFmpeg interne** (H.264, AAC)
- Envoie le stream RTMP vers : `rtmp://192.168.1.28:1935/live`

**Résultat :** Un seul stream part d'OBS vers Nginx.

---

### Étape 2 : Nginx Reçoit le Stream

**Nginx RTMP :**
- Écoute sur le port **1935**
- Reçoit le stream d'OBS sur l'application `/live`
- **Stocke le stream en mémoire** (buffer)
- Rend le stream accessible via : `rtmp://localhost:1935/live`

**Configuration Nginx :**
```nginx
rtmp {
    server {
        listen 1935;
        application live {
            live on;
            record off;
            # Pas de push direct ici en mode FFmpeg Proxy
        }
    }
}
```

**Résultat :** Le stream est disponible localement pour FFmpeg.

---

### Étape 3 : FFmpeg Relay (Le Cœur du Système)

**Pour chaque stream activé**, notre système démarre **un processus FFmpeg indépendant** :

#### Processus FFmpeg pour Facebook :

```bash
ffmpeg.exe \
  -i rtmp://localhost:1935/live \
  -c copy \
  -f flv \
  -fflags nobuffer \
  -flags low_delay \
  -avioflags direct \
  -rtmp_live live \
  -metadata comment="STREAM_ID:1" \
  rtmp://localhost:19350/rtmp/FB-1329771134905053-0-Ab1etr54VpnepYC0GiXwF-r3
```

**Ce que fait ce processus :**
1. **Lit** le stream depuis `rtmp://localhost:1935/live` (Nginx)
2. **Copie** les données sans ré-encoder (`-c copy`) → **Pas de latence ajoutée**
3. **Relaye** vers l'URL de destination (Facebook via Stunnel sur port 19350)

#### Processus FFmpeg pour TikTok :

```bash
ffmpeg.exe \
  -i rtmp://localhost:1935/live \
  -c copy \
  -f flv \
  -fflags nobuffer \
  -flags low_delay \
  -metadata comment="STREAM_ID:4" \
  rtmp://push-rtmp-f5-tt04.tiktokcdn-eu.com:443/game/stream-7504753491002608406...
```

**Même principe** pour chaque plateforme.

---

## ⚡ Caractéristiques Techniques

### 1. **Un Processus par Stream**

```
Stream #1 (Facebook)   → FFmpeg Process #1 (PID: 1234)
Stream #2 (Facebook)   → FFmpeg Process #2 (PID: 1235)
Stream #3 (OneStream)  → FFmpeg Process #3 (PID: 1236)
Stream #4 (TikTok)     → FFmpeg Process #4 (PID: 1237)
...
```

**Avantage :** Si un stream plante, les autres continuent.

### 2. **Pas de Ré-encodage** (`-c copy`)

**FFmpeg ne ré-encode PAS** le stream :
- Lit les paquets vidéo/audio depuis Nginx
- Les **copie directement** vers la destination
- **Latence minimale** (quelques millisecondes)
- **Pas de perte de qualité**

### 3. **Options de Latence Réduite**

```bash
-fflags nobuffer     # Pas de buffer, envoie immédiatement
-flags low_delay      # Mode basse latence
-avioflags direct     # Accès direct aux I/O
-rtmp_live live       # Mode live RTMP
```

**Résultat :** Latence ajoutée < 100ms par stream.

### 4. **Identification des Processus**

Chaque processus FFmpeg a un **tag unique** :
```
-metadata comment="STREAM_ID:1"
```

**Pourquoi ?** Pour pouvoir arrêter le bon processus si besoin, même après redémarrage du serveur.

---

## 🔄 Cycle de Vie d'un Stream FFmpeg

### Quand Vous Activez un Stream :

1. **Interface web** : Vous cliquez "Activer" sur un stream
2. **Backend Flask** : Reçoit la commande `PUT /api/streams/1`
3. **Vérification** : Vérifie que le stream est activé (`enabled: true`)
4. **Démarrage FFmpeg** : Lance `start_ffmpeg_relay(stream_id, url)`
5. **Processus créé** : Un nouveau processus FFmpeg démarre
6. **Connexion** : FFmpeg se connecte à Nginx (`rtmp://localhost:1935/live`)
7. **Relay actif** : Le stream est relayé vers la plateforme
8. **Statut mis à jour** : Le processus est enregistré dans `FFMPEG_PROCESSES`

**Durée totale :** < 2 secondes

### Quand Vous Désactivez un Stream :

1. **Interface web** : Vous cliquez "Désactiver" sur un stream
2. **Backend Flask** : Reçoit la commande `PUT /api/streams/1`
3. **Arrêt FFmpeg** : Lance `stop_ffmpeg_relay(stream_id)`
4. **Fermeture propre** : Envoie `terminate()` au processus
5. **Forçage si nécessaire** : Si le processus ne s'arrête pas, utilise `taskkill`
6. **Nettoyage** : Supprime le processus de `FFMPEG_PROCESSES`
7. **Vérification** : Vérifie qu'aucun processus FFmpeg orphelin ne reste

**Durée totale :** < 1 seconde

---

## 📈 Flux de Données en Temps Réel

### Exemple avec 3 Streams Actifs :

```
OBS (30 FPS, 1080p, 6000 kbps)
    ↓
Nginx (reçoit: 6000 kbps)
    ↓
    ├──→ FFmpeg #1 → Facebook (relaye: 6000 kbps)
    ├──→ FFmpeg #2 → TikTok (relaye: 6000 kbps)
    └──→ FFmpeg #3 → OneStream (relaye: 6000 kbps)
```

**Bande passante totale sortante :** 18 000 kbps (3 × 6000)

**Note :** Chaque processus FFmpeg lit **indépendamment** depuis Nginx. Nginx peut servir plusieurs lecteurs simultanément.

---

## 🎯 Avantages de Cette Architecture

### ✅ Pour OBS :
- **Un seul stream à envoyer** → Vers Nginx uniquement
- **Pas besoin de configurer** plusieurs destinations dans OBS
- **Stable** → Pas de gestion de multiples connexions

### ✅ Pour Nginx :
- **Reçoit un seul stream** → Simplicity
- **Peut servir plusieurs lecteurs** → FFmpeg processes
- **Pas de configuration complexe** → Juste un récepteur

### ✅ Pour Vous :
- **Activer/Désactiver à la volée** → Sans couper les autres
- **Voir les changements en direct** → Sur les plateformes
- **Pas de redémarrage** → Tout fonctionne en continu

---

## 🔍 Vérification en Temps Réel

### Dans le Gestionnaire des Tâches :

1. Ouvrez **Gestionnaire des tâches** (Ctrl+Shift+Esc)
2. Recherchez **"ffmpeg.exe"**
3. Vous devriez voir **un processus par stream activé**

**Exemple :**
```
ffmpeg.exe (PID: 1234) - STREAM_ID:1 (Facebook)
ffmpeg.exe (PID: 1235) - STREAM_ID:2 (Facebook)
ffmpeg.exe (PID: 1236) - STREAM_ID:3 (OneStream)
ffmpeg.exe (PID: 1237) - STREAM_ID:4 (TikTok)
```

### Dans l'Interface Web :

- **Statut des streams** : Affiche si FFmpeg est actif pour chaque stream
- **Indicateur visuel** : Icône/texte indiquant le statut du relay

---

## ⚠️ Que Se Passe-t-il Si...

### Si OBS s'arrête ?

- **Nginx** : Continue d'écouter, mais ne reçoit plus de données
- **FFmpeg** : Les processus restent actifs, mais attendent des données
- **Plateformes** : Le stream s'arrête (pas de données = stream offline)

### Si un FFmpeg plante ?

- **Ce stream** : S'arrête sur la plateforme concernée
- **Les autres streams** : Continuent normalement (processus indépendants)
- **OBS** : Continue de streamer vers Nginx
- **Nginx** : Continue de recevoir et servir le stream

### Si Nginx s'arrête ?

- **Tous les FFmpeg** : Ne peuvent plus lire le stream source
- **Tous les streams** : S'arrêtent sur les plateformes
- **OBS** : Peut continuer d'envoyer, mais personne ne lit

---

## 🎬 Résumé

**Quand OBS et les flux sont ouverts :**

1. ✅ **OBS stream** → Vers Nginx (un seul stream)
2. ✅ **Nginx reçoit** → Stocke le stream en mémoire
3. ✅ **FFmpeg relais** → Un processus par stream activé
4. ✅ **Chaque FFmpeg** → Lit depuis Nginx et envoie vers la plateforme
5. ✅ **Tout fonctionne** → En temps réel, sans interruption

**FFmpeg = Multiplicateur de streams** 🚀

Un stream d'OBS → Plusieurs streams vers les plateformes, chacun contrôlable indépendamment !



