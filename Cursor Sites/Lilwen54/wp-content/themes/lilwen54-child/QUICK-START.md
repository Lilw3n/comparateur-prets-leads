# ⚡ Démarrage Rapide

## Installation en 3 étapes

### 1. Installer les dépendances
```bash
cd wp-content/themes/lilwen54-child
npm install
```

### 2. Build les assets
```bash
npm run build
```

### 3. Activer le thème
- Allez dans **Apparence > Thèmes**
- Activez **Lilwen54 Child**

## 🎨 C'est prêt !

Votre site utilise maintenant :
- ✅ React 18 pour les composants interactifs
- ✅ Vue 3 pour les composants alternatifs
- ✅ Tailwind CSS pour le design moderne
- ✅ Vite pour le build ultra-rapide
- ✅ Design 100% responsive
- ✅ Animations fluides
- ✅ Performance optimale

## 🚨 En cas de problème

**Désactivation rapide :**
Ouvrez `functions.php` ligne 13 et changez :
```php
define( 'LILWEN54_MODERN_MODE', false );
```

Le site revient immédiatement au thème parent classique.

## 📝 Utilisation

### Ajouter un composant React dans une page
```
[lilwen54_react component="hero"]
```

### Ajouter un composant Vue
```
[lilwen54_vue component="header"]
```

### Dans un template PHP
```php
<div data-react-app="hero"></div>
<div data-vue-app="footer"></div>
```

## 🔄 Développement

**Mode watch (rebuild automatique) :**
```bash
npm run watch
```

**Mode dev avec hot reload :**
```bash
npm run dev
```

## 📚 Documentation complète

- `README-INSTALLATION.md` - Guide d'installation détaillé
- `EMERGENCY-DISABLE.md` - Désactivation d'urgence

