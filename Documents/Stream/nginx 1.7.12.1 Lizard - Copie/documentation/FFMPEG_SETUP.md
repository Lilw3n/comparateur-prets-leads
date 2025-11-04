# Configuration FFmpeg pour Contrôle Dynamique des Streams

## 🎯 Pourquoi FFmpeg ?

Avec le mode FFmpeg activé, vous pouvez **activer/désactiver des streams sans couper les autres streams actifs**. 

**Avant (mode Nginx classique)** : Chaque activation/désactivation nécessite un `nginx -s reload`, ce qui coupe temporairement tous les streams.

**Avec FFmpeg** : Chaque stream est géré par un processus FFmpeg indépendant. Vous pouvez démarrer/arrêter un stream sans affecter les autres.

## 📥 Installation de FFmpeg

### Windows

1. **Téléchargez FFmpeg** :
   - Site officiel : https://ffmpeg.org/download.html
   - Windows builds : https://www.gyan.dev/ffmpeg/builds/
   - Téléchargez la version "ffmpeg-release-essentials.zip"

2. **Installez FFmpeg** :
   - Décompressez l'archive dans `C:\ffmpeg\`
   - OU dans `C:\Program Files\ffmpeg\`
   - OU ajoutez `ffmpeg.exe` dans le dossier `nginx 1.7.12.1 Lizard - Copie\`

3. **Ajoutez FFmpeg au PATH** (recommandé) :
   - Clic droit sur "Ce PC" → Propriétés
   - Paramètres système avancés → Variables d'environnement
   - Dans "Variables système", trouvez "Path" → Modifier
   - Ajoutez : `C:\ffmpeg\bin` (ou votre chemin d'installation)
   - Cliquez sur OK et redémarrez votre terminal

4. **Vérifiez l'installation** :
   ```powershell
   ffmpeg -version
   ```

### Alternative : FFmpeg portable

Si vous ne voulez pas modifier le PATH système, vous pouvez :
- Placer `ffmpeg.exe` dans le dossier `nginx 1.7.12.1 Lizard - Copie\`
- Le système le détectera automatiquement

## ⚙️ Configuration

Le mode FFmpeg est **activé par défaut** dans `stream_manager.py` :
```python
USE_FFMPEG_PROXY = True
```

Pour désactiver et revenir au mode Nginx classique :
```python
USE_FFMPEG_PROXY = False
```

## 🚀 Utilisation

Une fois FFmpeg installé :

1. **Redémarrez le serveur Flask** (`start_stream_manager.bat`)

2. **Démarrer Nginx** :
   - L'interface web affichera "Mode FFmpeg" activé
   - Nginx ne fera QUE recevoir les streams (pas de push direct)

3. **Activer/Désactiver un stream** :
   - Cliquez sur le toggle d'un stream dans l'interface
   - Le stream sera activé/désactivé **instantanément** via FFmpeg
   - **Les autres streams ne seront PAS coupés**

4. **Vérifier le statut** :
   - L'interface affiche le statut de chaque processus FFmpeg
   - `ffmpeg_running: true` = le relais est actif

## 📊 Comment ça fonctionne ?

```
OBS → rtmp://localhost:1935/live (Nginx reçoit)
           ↓
      [Nginx RTMP Server]
           ↓
   ┌───────┴───────┐
   │               │
[FFmpeg 1]    [FFmpeg 2]
   │               │
   ↓               ↓
Facebook      TikTok
```

- **Nginx** : Reçoit le stream une seule fois depuis OBS
- **FFmpeg** : Chaque processus FFmpeg relaye vers une destination spécifique
- **Avantage** : Démarrer/arrêter un FFmpeg ne touche pas les autres

## 🔍 Vérification

### Vérifier que FFmpeg fonctionne

1. Ouvrez le Gestionnaire des tâches (Ctrl+Shift+Esc)
2. Recherchez "ffmpeg.exe"
3. Vous devriez voir un processus ffmpeg.exe par stream activé

### Logs FFmpeg

Les erreurs FFmpeg sont capturées et affichées dans l'interface. Si un stream ne démarre pas, vérifiez :
- Que FFmpeg est bien installé et dans le PATH
- Que l'URL de destination est correcte
- Que Nginx est démarré et reçoit bien le stream sur `rtmp://localhost:1935/live`

## ⚠️ Dépannage

### "FFmpeg introuvable"

- Vérifiez que FFmpeg est dans le PATH : `ffmpeg -version`
- OU placez `ffmpeg.exe` dans le dossier nginx
- Redémarrez le serveur Flask

### "FFmpeg s'est arrêté immédiatement"

- L'URL de destination est peut-être incorrecte
- Le stream source (Nginx) n'est peut-être pas démarré
- Vérifiez les logs dans l'interface web

### Les streams ne partent pas

- Vérifiez que Nginx est démarré
- Vérifiez que vous envoyez bien vers `rtmp://localhost:1935/live` depuis OBS
- Vérifiez que les processus FFmpeg tournent dans le gestionnaire de tâches

## 💡 Avantages du Mode FFmpeg

✅ **Pas de coupure** : Activer/désactiver un stream n'affecte pas les autres  
✅ **Contrôle instantané** : Changements immédiats sans rechargement  
✅ **Débogage facile** : Chaque stream est un processus indépendant  
✅ **Réconnexion automatique** : FFmpeg se reconnecte automatiquement en cas de problème  

## 🔄 Retour au Mode Nginx Classique

Si vous préférez utiliser les push Nginx directs :

1. Dans `stream_manager.py`, changez :
   ```python
   USE_FFMPEG_PROXY = False
   ```

2. Redémarrez le serveur Flask

3. Nginx utilisera les push directs (reload nécessaire pour changer)



