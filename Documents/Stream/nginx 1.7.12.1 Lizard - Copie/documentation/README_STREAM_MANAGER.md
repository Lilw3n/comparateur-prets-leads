# 🎬 Gestionnaire de Streams RTMP

Une solution moderne pour gérer vos streams RTMP sans redémarrer Nginx !

## ✨ Fonctionnalités

- ✅ Interface web moderne et intuitive
- ✅ Ajout/suppression de streams en temps réel
- ✅ Activation/désactivation de streams sans redémarrer Nginx
- ✅ Rechargement automatique de la configuration Nginx
- ✅ Gestion visuelle des streams avec codes couleur par plateforme
- ✅ Support de toutes les plateformes (Facebook, TikTok, Restream, Twitch, YouTube, etc.)

## 🚀 Installation

1. **Installer Python 3.7 ou supérieur** (si pas déjà installé)
   - Télécharger depuis https://www.python.org/downloads/

2. **Installer les dépendances Python**
   ```bash
   pip install -r requirements.txt
   ```

## 📖 Utilisation

### Démarrage rapide

1. **Lancer le gestionnaire de streams**
   - Double-cliquer sur `start_stream_manager.bat`
   - Ou en ligne de commande : `python stream_manager.py`

2. **Accéder à l'interface web**
   - Ouvrir votre navigateur sur : http://localhost:5000

3. **Gérer vos streams**
   - Cliquer sur "Ajouter un Stream" pour ajouter un nouveau stream
   - Utiliser les boutons "Modifier", "Activer/Désactiver", "Supprimer" sur chaque carte de stream
   - Les modifications sont appliquées automatiquement à Nginx

## 📁 Structure des fichiers

```
.
├── stream_manager.py          # Backend Flask (API)
├── streams.json                # Base de données des streams
├── stream_ui/                 # Interface web
│   ├── index.html
│   ├── style.css
│   └── script.js
├── conf/
│   ├── nginx.conf             # Configuration principale Nginx
│   └── rtmp_streams.conf      # Configuration RTMP générée (auto)
└── requirements.txt            # Dépendances Python
```

## 🔧 Configuration

### Ajouter un stream manuellement

Vous pouvez aussi éditer le fichier `streams.json` directement :

```json
{
  "id": "8",
  "name": "Mon Stream",
  "url": "rtmp://example.com/live/stream-key",
  "enabled": true,
  "platform": "Autre"
}
```

Puis lancer `python stream_manager.py` pour régénérer la config.

### Port du serveur web

Par défaut, l'interface web tourne sur le port **5000**. 
Pour changer, modifier `stream_manager.py` :

```python
app.run(host='0.0.0.0', port=5000, debug=True)
```

## 🎨 Plateformes supportées

- Facebook Live
- TikTok Live
- Restream.io
- Twitch
- YouTube Live
- Eklipse
- OneStream Studio
- Instagram Live
- Et toute autre plateforme RTMP

## ⚠️ Notes importantes

1. **Nginx doit être démarré** avant d'utiliser le gestionnaire
2. Le fichier `conf/rtmp_streams.conf` est **généré automatiquement** - ne pas l'éditer manuellement
3. Les modifications sont appliquées via `nginx -s reload` (pas de redémarrage complet)
4. Assurez-vous que Nginx a les permissions nécessaires pour lire `conf/rtmp_streams.conf`

## 🐛 Résolution de problèmes

### Le rechargement de Nginx échoue

- Vérifier que Nginx est bien démarré
- Vérifier que `nginx.exe` existe dans le répertoire principal
- Vérifier les permissions d'accès aux fichiers de configuration

### L'interface web ne se charge pas

- Vérifier que le port 5000 n'est pas utilisé par un autre programme
- Vérifier le firewall Windows
- Vérifier les logs dans la console Python

### Les streams ne sont pas appliqués

- Vérifier que `conf/rtmp_streams.conf` est bien généré
- Vérifier les logs Nginx dans `logs/error.log`
- Utiliser le bouton "Recharger Nginx" dans l'interface

## 📝 Licence

Ce projet est fourni tel quel pour une utilisation personnelle.

## 🤝 Contribution

N'hésitez pas à améliorer ce projet selon vos besoins !

---

**Profitez de vos streams sans interruption ! 🎥✨**

