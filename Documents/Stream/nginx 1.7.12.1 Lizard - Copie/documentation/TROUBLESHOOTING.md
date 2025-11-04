# 🔧 Guide de Résolution des Problèmes

## ❌ Erreur "Erreur de connexion au serveur"

Cette erreur signifie que votre navigateur ne peut pas se connecter au serveur Flask.

### ✅ Solutions

#### 1. Vérifier que le serveur est démarré

**Vérifiez si le serveur tourne :**
- Double-cliquez sur `test_connection.bat`
- Ou ouvrez un terminal et exécutez : `python test_connection.py`

**Si le serveur n'est pas démarré :**
- Double-cliquez sur `start_stream_manager.bat`
- Attendez que vous voyiez "🚀 SERVEUR DÉMARRÉ !"
- Notez le port affiché (ex: `http://localhost:5000`)

#### 2. Vérifier le port utilisé

Le serveur peut utiliser un port différent de 5000 si ce port est occupé.

**Pour savoir quel port utiliser :**
- Regardez la console où `start_stream_manager.bat` a été lancé
- Vous verrez : `📍 URL PRINCIPALE: → http://localhost:XXXX`
- Utilisez cette URL dans votre navigateur

#### 3. Vérifier que les dépendances sont installées

```bash
pip install -r requirements.txt
```

#### 4. Vérifier le firewall Windows

- Windows Defender pourrait bloquer le serveur
- Autorisez Python dans le firewall si nécessaire

#### 5. Réessayer après quelques secondes

Le serveur peut prendre quelques secondes pour démarrer complètement.

---

## 🔍 Diagnostic étape par étape

### Étape 1 : Tester la connexion

```bash
python test_connection.py
```

### Étape 2 : Vérifier que Python fonctionne

```bash
python --version
```

### Étape 3 : Vérifier que Flask est installé

```bash
python -c "import flask; print(flask.__version__)"
```

### Étape 4 : Vérifier les ports disponibles

```bash
python check_port.py
```

---

## 📝 Messages d'erreur courants

### "nginx.exe introuvable"
- Vérifiez que vous êtes dans le bon répertoire
- Vérifiez que `nginx.exe` existe dans le répertoire

### "stunnel.exe introuvable"
- Vérifiez que Stunnel est installé dans `C:\Users\Diddy\Documents\Stream\stunnel`
- Ajustez le chemin dans `stream_manager.py` si nécessaire

### "Port 5000 occupé"
- Le serveur essaiera automatiquement les ports 5001, 5002, etc.
- Regardez la console pour voir quel port est utilisé

---

## 🆘 Besoin d'aide ?

Si le problème persiste :
1. Vérifiez les messages d'erreur dans la console Python
2. Vérifiez les logs dans `logs/error.log` (pour Nginx)
3. Essayez de redémarrer le serveur
4. Vérifiez que tous les fichiers sont présents

