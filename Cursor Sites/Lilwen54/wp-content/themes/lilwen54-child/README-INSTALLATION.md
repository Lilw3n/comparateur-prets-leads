# 🚀 Installation du thème moderne Lilwen54

## Prérequis

- Node.js 18+ et npm
- WordPress 6.0+
- Thème parent Twenty Twenty-Five activé

## Installation

### 1. Installer les dépendances

```bash
cd wp-content/themes/lilwen54-child
npm install
```

### 2. Build des assets

**Pour le développement :**
```bash
npm run dev
```

**Pour la production :**
```bash
npm run build
```

**Mode watch (rebuild automatique) :**
```bash
npm run watch
```

### 3. Activer le thème

1. Allez dans **Apparence > Thèmes**
2. Activez **Lilwen54 Child**

## Structure du projet

```
lilwen54-child/
├── src/
│   ├── components/
│   │   ├── react/          # Composants React
│   │   └── vue/            # Composants Vue
│   ├── styles/
│   │   └── main.css        # Styles Tailwind
│   ├── main.js             # Point d'entrée
│   ├── react-app.jsx       # App React
│   └── vue-app.js          # App Vue
├── dist/                    # Assets buildés (généré)
├── functions.php            # Fonctions WordPress
├── style.css                # Style de base
├── package.json             # Dépendances npm
├── vite.config.js           # Configuration Vite
└── tailwind.config.js       # Configuration Tailwind
```

## Utilisation

### Shortcodes WordPress

**Composant React :**
```
[lilwen54_react component="hero" id="my-hero"]
```

**Composant Vue :**
```
[lilwen54_vue component="header" id="my-header"]
```

### Attributs data

Ajoutez directement dans vos templates :

```html
<!-- React -->
<div data-react-app="hero"></div>
<div data-react-app="header"></div>
<div data-react-app="features"></div>

<!-- Vue -->
<div data-vue-app="hero"></div>
<div data-vue-app="footer"></div>
```

## Développement

### Mode développement avec hot reload

```bash
npm run dev
```

Vite lancera un serveur de développement avec hot reload.

### Build pour production

```bash
npm run build
```

Les assets seront optimisés et minifiés dans `dist/`.

## Personnalisation

### Couleurs

Modifiez `tailwind.config.js` :

```js
colors: {
  primary: { /* vos couleurs */ },
  accent: { /* vos couleurs */ }
}
```

### Composants

Ajoutez vos composants dans :
- `src/components/react/` pour React
- `src/components/vue/` pour Vue

### Styles

Modifiez `src/styles/main.css` pour ajouter vos styles personnalisés.

## Désactivation d'urgence

Voir `EMERGENCY-DISABLE.md` pour désactiver rapidement le thème moderne.

## Support

- Documentation : Voir les fichiers README
- Désactivation : Voir EMERGENCY-DISABLE.md
- Synchronisation : Voir README-SYNC.md (à la racine)

