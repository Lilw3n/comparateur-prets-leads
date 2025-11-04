# 🚀 Démarrage Rapide

## 1️⃣ Installation des dépendances

Ouvrez un terminal dans ce dossier et exécutez :

```bash
pip install -r requirements.txt
```

## 2️⃣ Démarrer le gestionnaire

**Option A :** Double-cliquez sur `start_stream_manager.bat`

**Option B :** En ligne de commande :
```bash
python stream_manager.py
```

## 3️⃣ Accéder à l'interface

Ouvrez votre navigateur sur : **http://localhost:5000**

## 4️⃣ Utilisation

- ➕ **Ajouter un stream** : Cliquez sur "Ajouter un Stream"
- ✏️ **Modifier** : Cliquez sur "Modifier" sur une carte de stream
- ⏯️ **Activer/Désactiver** : Utilisez le bouton correspondant
- 🗑️ **Supprimer** : Cliquez sur "Supprimer"
- 🔄 **Recharger Nginx** : Utilisez le bouton dans la barre de statistiques

**Les modifications sont appliquées automatiquement !** Pas besoin de redémarrer Nginx manuellement.

## ⚠️ Important

- Assurez-vous que **Nginx est démarré** avant d'utiliser le gestionnaire
- Le fichier `conf/rtmp_streams.conf` est généré automatiquement - ne l'éditez pas manuellement
- Vos streams actuels ont été extraits dans `streams.json`

## 🎉 C'est tout !

Profitez de votre interface moderne pour gérer vos streams ! 🎬

