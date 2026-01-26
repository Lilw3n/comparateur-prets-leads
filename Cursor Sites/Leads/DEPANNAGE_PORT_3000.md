# 🔧 Dépannage - Rien ne s'affiche sur localhost:3000

## ✅ Vérifications à Faire

### 1. Vérifier que le serveur tourne

Le serveur est détecté sur le port 3000 (processus 62328).

### 2. URLs à Essayer

Essayez ces URLs dans votre navigateur :

1. **http://localhost:3000**
2. **http://127.0.0.1:3000**
3. **http://[::1]:3000**

### 3. Vérifier le Navigateur

- **Ouvrez les outils développeur** (F12)
- Allez dans l'onglet **Console**
- Regardez s'il y a des erreurs

### 4. Redémarrer le Serveur

Si rien ne fonctionne, redémarrez le serveur :

```bash
# Arrêter tous les processus Node
# Puis dans le dossier du projet :

cd "F:\Cursor Sites\Leads"
npm run dev
```

Cela démarre :
- Le backend sur le port **3002**
- Le frontend sur le port **3000**

### 5. Vérifier les Ports

Vérifiez que les ports ne sont pas bloqués :

```powershell
# Vérifier le port 3000
netstat -ano | findstr ":3000"

# Vérifier le port 3002 (backend)
netstat -ano | findstr ":3002"
```

### 6. Vérifier le Backend

Le frontend a besoin du backend pour fonctionner. Vérifiez que le backend tourne :

```bash
cd backend
npm run dev
```

Le backend doit être sur **http://localhost:3002**

### 7. Erreurs Communes

#### Erreur "Cannot GET /"
- Le serveur Vite n'est pas démarré
- Solution : `cd frontend && npm run dev`

#### Erreur "ECONNREFUSED"
- Le backend n'est pas démarré
- Solution : `cd backend && npm run dev`

#### Page blanche
- Erreur JavaScript dans la console
- Ouvrez F12 → Console pour voir l'erreur

#### Port déjà utilisé
- Un autre processus utilise le port 3000
- Solution : Changez le port dans `frontend/vite.config.ts`

## 🚀 Démarrage Complet

Pour démarrer tout le projet :

```bash
# Depuis la racine du projet
cd "F:\Cursor Sites\Leads"

# Installer les dépendances (si pas déjà fait)
npm run install:all

# Démarrer les deux serveurs
npm run dev
```

Cela démarre :
- ✅ Backend sur http://localhost:3002
- ✅ Frontend sur http://localhost:3000

## 📋 Checklist

- [ ] Backend démarré (port 3002)
- [ ] Frontend démarré (port 3000)
- [ ] Navigateur ouvert sur http://localhost:3000
- [ ] Console du navigateur vérifiée (F12)
- [ ] Pas d'erreurs dans la console

## 🆘 Si Rien ne Fonctionne

1. **Arrêtez tous les processus Node** :
   ```powershell
   Get-Process node | Stop-Process -Force
   ```

2. **Redémarrez proprement** :
   ```bash
   cd "F:\Cursor Sites\Leads"
   npm run dev
   ```

3. **Attendez que les deux serveurs démarrent** (vous verrez des messages dans le terminal)

4. **Ouvrez http://localhost:3000 dans votre navigateur**

## 📞 Informations de Debug

Si le problème persiste, vérifiez :

- **Version Node** : `node --version` (doit être >= 18.0.0)
- **Version npm** : `npm --version` (doit être >= 9.0.0)
- **Fichiers présents** : Vérifiez que `frontend/src/main.tsx` existe
- **Dépendances installées** : `cd frontend && npm list`
