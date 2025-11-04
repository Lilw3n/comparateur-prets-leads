# 🎬 Gestionnaire de Streams RTMP by Lilwen54

Interface web moderne pour gérer vos streams RTMP vers plusieurs plateformes (Facebook, YouTube, TikTok, Twitch, etc.) sans redémarrer Nginx.

## ✨ Fonctionnalités

- 🎯 **Gestion multi-plateformes** : Facebook, YouTube, TikTok, Twitch, Restream, Eklipse, OneStream, Instagram
- ⚡ **Contrôle dynamique** : Activez/désactivez les streams sans redémarrer Nginx (mode FFmpeg Proxy)
- 🔄 **Mode hybride** : FFmpeg Proxy (contrôle dynamique) ou Nginx Direct (latence minimale)
- 🎛️ **Interface moderne** : Interface web intuitive avec thème sombre
- 📊 **Statistiques en temps réel** : Suivi des streams actifs
- 🔌 **Intégration OBS WebSocket** : Synchronisation automatique avec OBS Studio
- 📋 **Actions en masse** : Activez/désactivez tous les streams d'un coup ou sélectionnez-en plusieurs

## 🚀 Installation

1. **Téléchargez le projet** ou clonez le repository :
   ```bash
   git clone https://github.com/Lilw3n/Nginx-Stunnel-Stream-Manager.git
   cd Nginx-Stunnel-Stream-Manager
   ```

2. **Installez Python** (3.7 ou supérieur)

3. **Installez les dépendances Python** :
   ```bash
   pip install -r requirements.txt
   ```

4. **Installez Nginx avec module RTMP** (voir section "Installation de Nginx et Stunnel" ci-dessous)

5. **Configurez vos streams** (voir section Configuration)

6. **Lancez** `start_stream_manager.bat`

7. **Ouvrez votre navigateur** à l'adresse affichée (généralement `http://localhost:5000`)

## 📋 Prérequis

- Python 3.7+
- **Nginx avec module RTMP** (voir section Installation ci-dessous)
- FFmpeg (pour le mode FFmpeg Proxy) - optionnel mais recommandé
- Stunnel (optionnel, pour Facebook/Instagram) - voir section Installation

## 📦 Installation de Nginx et Stunnel

### Nginx avec module RTMP

Le projet nécessite **Nginx avec le module RTMP** compilé pour Windows.

**Option 1 : Utiliser Nginx inclus (si disponible)**
- Placez `nginx.exe` dans le dossier racine du projet
- Ou modifiez `stream_manager.py` ligne 687-692 pour pointer vers votre installation Nginx

**Option 2 : Télécharger Nginx RTMP pour Windows**
- Téléchargez depuis : https://github.com/arut/nginx-rtmp-module/wiki/Installing-via-Builds
- Ou utilisez une version précompilée avec RTMP
- Placez `nginx.exe` dans le dossier racine du projet

### Stunnel (optionnel, pour Facebook/Instagram)

**Option 1 : Installation manuelle**
1. Téléchargez Stunnel pour Windows : https://www.stunnel.org/downloads.html
2. Installez Stunnel (par exemple dans `C:/stunnel`)
3. Modifiez `stream_manager.py` lignes 44-47 pour pointer vers votre installation :
   ```python
   STUNNEL_DIR = Path("C:/stunnel")
   STUNNEL_EXE = STUNNEL_DIR / "bin" / "stunnel.exe"
   STUNNEL_CONF = STUNNEL_DIR / "config" / "stunnel.conf"
   ```

**Option 2 : Désactiver Stunnel**
- Si vous n'utilisez pas Facebook/Instagram, vous pouvez ignorer Stunnel
- Le gestionnaire fonctionnera sans Stunnel pour les autres plateformes

## ⚙️ Configuration

1. **Copiez les fichiers d'exemple** :
   - `streams.json.example` → `streams.json`
   - `config.json.example` → `config.json`

2. **Configurez vos streams** dans `streams.json` :
   ```json
   [
     {
       "id": "1",
       "name": "Mon Stream",
       "url": "rtmp://plateforme.com/live/STREAM_KEY",
       "enabled": true,
       "platform": "YouTube"
     }
   ]
   ```

3. **Configurez le mode** dans `config.json` :
   - `use_ffmpeg_proxy: true` → Mode FFmpeg (contrôle dynamique)
   - `use_ffmpeg_proxy: false` → Mode Nginx Direct (latence minimale)

## 🎮 Utilisation

### Démarrage

Lancez `start_stream_manager.bat` et ouvrez l'interface web dans votre navigateur.

### Ajouter un stream

1. Cliquez sur **"Ajouter un Stream"**
2. Remplissez les informations :
   - Nom du stream
   - Plateforme
   - URL RTMP complète
3. Cochez "Stream actif" si vous voulez l'activer immédiatement
4. Cliquez sur **"Enregistrer"**

### Activer/Désactiver des streams

- **Un seul stream** : Utilisez le bouton "Activer/Désactiver" sur chaque carte
- **Tous les streams** : Utilisez le toggle "Tout activer/désactiver" dans le header
- **Plusieurs streams** : Cochez les cases à cocher puis utilisez les boutons dans la barre de sélection

### Démarrer Nginx/Stunnel

Utilisez les boutons dans les cartes de statut pour démarrer/arrêter Nginx et Stunnel.

## 🔧 Modes de fonctionnement

### Mode FFmpeg Proxy (Recommandé)

- ✅ Contrôle dynamique sans couper les autres streams
- ✅ Activation/désactivation instantanée
- ✅ Latence légèrement plus élevée (+0.5-1s)
- ⚠️ Nécessite FFmpeg

### Mode Nginx Direct

- ✅ Latence minimale
- ⚠️ Nécessite un rechargement Nginx pour activer/désactiver
- ⚠️ Le module RTMP ne recharge pas toujours correctement (peut nécessiter un redémarrage)

## 📁 Structure du projet

```
.
├── start_stream_manager.bat    # Script de démarrage
├── stream_manager.py          # Serveur Flask backend
├── stream_ui/                  # Interface web frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
├── conf/                       # Configuration Nginx
│   ├── nginx.conf
│   └── rtmp_streams.conf
├── streams.json.example        # Exemple de configuration streams
├── config.json.example         # Exemple de configuration
└── requirements.txt            # Dépendances Python
```

## 🔒 Sécurité

⚠️ **Important** : Les fichiers `streams.json` et `config.json` contiennent des informations sensibles (clés de stream RTMP). Ils sont exclus du repository Git (voir `.gitignore`).

## 📝 Documentation

- `FFMPEG_SETUP.md` - Guide d'installation FFmpeg
- `OBS_SETUP.md` - Configuration OBS WebSocket
- `QUICK_START.md` - Guide de démarrage rapide
- `TROUBLESHOOTING.md` - Solutions aux problèmes courants

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est fourni tel quel, sans garantie.

## 👤 Auteur

**Lilwen54**

---

⭐ Si ce projet vous est utile, n'hésitez pas à mettre une étoile !

