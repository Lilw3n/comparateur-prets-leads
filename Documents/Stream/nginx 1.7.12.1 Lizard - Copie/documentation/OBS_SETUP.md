# Guide de Configuration OBS avec Synchronisation Automatique

## 📋 Vue d'ensemble

Ce guide vous permet de synchroniser automatiquement vos flux entre Nginx et OBS, de manière à ce que :
- Quand vous désactivez un flux dans l'interface web → OBS le désactive automatiquement
- Quand vous réactivez un flux dans l'interface web → OBS le réactive automatiquement
- **Sans couper le stream principal d'OBS**

---

## 🔧 Étape 1 : Installer OBS WebSocket

### Windows

1. Téléchargez la dernière version depuis :
   https://github.com/obsproject/obs-websocket/releases

2. Téléchargez le fichier `.exe` (installateur Windows)

3. Exécutez l'installateur et suivez les instructions

4. Redémarrez OBS après l'installation

### Vérifier l'installation

1. Dans OBS, allez dans **Outils → Paramètres WebSocket**
2. Vous devriez voir les paramètres :
   - **Port serveur** : 4455 (par défaut)
   - **Mot de passe** : (optionnel, mais recommandé pour la sécurité)

3. Notez le port et le mot de passe (si configuré)

---

## 🔧 Étape 2 : Configurer OBS WebSocket dans le système

1. Ouvrez `config.json` dans le dossier du projet

2. Modifiez la section `obs_websocket` :
   ```json
   {
     "obs_websocket": {
       "enabled": true,
       "host": "localhost",
       "port": 4455,
       "password": "votre_mot_de_passe_obs"
     }
   }
   ```

3. Si vous n'avez pas configuré de mot de passe dans OBS, laissez `"password": ""`

4. Redémarrez le serveur Flask (`start_stream_manager.bat`)

---

## 🎬 Étape 3 : Configurer les Media Sources dans OBS

### Workflow attendu :

```
OBS → Envoie vers Nginx (rtmp://localhost:1935/live)
      ↓
Nginx → Distribue vers les plateformes
      ↓
Quand vous désactivez un flux → OBS désactive la source correspondante
```

### Configuration des Media Sources :

Pour chaque stream que vous voulez contrôler :

1. **Dans OBS**, créez une **nouvelle scène** (ou utilisez votre scène principale)

2. **Ajoutez une source "Media Source"** :
   - Clic droit dans la liste des sources → **Ajouter → Media Source**
   - Nommez-la exactement comme le stream dans l'interface web
   
   **Exemples :**
   - Si votre stream s'appelle "Facebook - SocialLIVE" → nommez la source "Facebook - SocialLIVE"
   - Si votre stream s'appelle "TikTok - Mangas et Jeux Videos" → nommez la source "TikTok - Mangas et Jeux Videos"

3. **Configuration de la Media Source** :
   - Cochez **"Réutiliser la source si elle existe déjà"**
   - Dans **Source**, sélectionnez **"Local File"** OU **"Network Stream"** selon votre besoin
   - Si vous utilisez **Network Stream**, entrez l'URL RTMP correspondante
   - **Important** : Le nom de la source doit correspondre EXACTEMENT au nom du stream dans l'interface web

### Exemple concret :

Si vous avez un stream configuré dans l'interface web :
- **Nom** : "Facebook - SocialLIVE"
- **URL** : `rtmp://localhost:19350/rtmp/FB-...`

Dans OBS :
1. Créez une Media Source nommée **"Facebook - SocialLIVE"**
2. Configurez-la pour recevoir depuis `rtmp://localhost:19350/rtmp/FB-...`
3. Quand vous désactivez "Facebook - SocialLIVE" dans l'interface web, cette source sera automatiquement désactivée dans OBS

---

## 🧪 Étape 4 : Tester la synchronisation

1. **Démarrez OBS** et configurez vos Media Sources

2. **Démarrez le serveur Flask** (`start_stream_manager.bat`)

3. **Démarrez Nginx** (via l'interface web)

4. **Dans l'interface web**, désactivez un stream

5. **Vérifiez dans OBS** : la Media Source correspondante devrait être désactivée automatiquement

6. **Réactivez le stream** dans l'interface web

7. **Vérifiez dans OBS** : la Media Source devrait être réactivée automatiquement

---

## ⚙️ Configuration avancée

### Si les noms ne correspondent pas

Le système cherche les sources OBS qui contiennent le nom du stream (ou vice versa).

**Exemples de correspondance :**
- Stream : "Facebook - SocialLIVE" ↔ Source OBS : "Facebook - SocialLIVE" ✅
- Stream : "Facebook - SocialLIVE" ↔ Source OBS : "Facebook SocialLIVE" ✅
- Stream : "TikTok" ↔ Source OBS : "TikTok - Mangas et Jeux Videos" ✅

### Activer/désactiver plusieurs sources

Si vous avez plusieurs sources avec des noms similaires, toutes seront activées/désactivées.

---

## 🔍 Dépannage

### "OBS WebSocket désactivé"
- Vérifiez que `"enabled": true` dans `config.json`
- Redémarrez le serveur Flask

### "Impossible de se connecter à OBS WebSocket"
- Vérifiez que OBS WebSocket est installé
- Vérifiez que OBS est démarré
- Vérifiez le port (par défaut 4455)
- Vérifiez le mot de passe si configuré

### "Aucune source OBS trouvée pour 'X'"
- Vérifiez que le nom de la source dans OBS correspond au nom du stream
- La correspondance est insensible à la casse (majuscules/minuscules)
- Vérifiez que la source existe dans au moins une scène

### Les sources OBS ne se désactivent pas
- Vérifiez les logs dans la console du serveur Flask
- Vérifiez que la connexion OBS WebSocket fonctionne
- Essayez de redémarrer OBS

---

## 📝 Notes importantes

- **Le stream principal d'OBS n'est JAMAIS coupé** lors des synchronisations
- Seules les Media Sources individuelles sont activées/désactivées
- Vous pouvez toujours contrôler manuellement les sources dans OBS
- La synchronisation fonctionne dans les deux sens (interface web ↔ OBS)

---

## 🎯 Workflow recommandé

1. **Configurer vos streams** dans l'interface web (URLs, noms, etc.)
2. **Démarrer OBS** et créer les Media Sources avec les mêmes noms
3. **Activer OBS WebSocket** dans `config.json`
4. **Tester** la synchronisation avec un stream de test
5. **Produire en direct** en utilisant l'interface web pour gérer les flux

---

**Besoin d'aide ?** Vérifiez les logs du serveur Flask pour voir les messages d'erreur détaillés.



