# 🚨 Désactivation d'urgence du thème moderne

## Méthode 1 : Via functions.php (Rapide)

Ouvrez `wp-content/themes/lilwen54-child/functions.php` et changez la ligne 13 :

```php
// AVANT
define( 'LILWEN54_MODERN_MODE', true );

// APRÈS
define( 'LILWEN54_MODERN_MODE', false );
```

Le site reviendra immédiatement au thème parent classique.

## Méthode 2 : Via wp-config.php (Ultra rapide)

Ajoutez cette ligne dans `wp-config.php` (avant la ligne "That's all, stop editing!") :

```php
define( 'LILWEN54_MODERN_MODE', false );
```

## Méthode 3 : Désactiver le thème enfant

1. Allez dans **Apparence > Thèmes**
2. Activez le thème parent **Twenty Twenty-Five**
3. Le thème enfant sera désactivé automatiquement

## Méthode 4 : Renommer le dossier (Dernier recours)

Via FTP, renommez le dossier :
- `wp-content/themes/lilwen54-child` → `wp-content/themes/lilwen54-child-disabled`

WordPress reviendra automatiquement au thème parent.

## Vérification

Après désactivation, le site devrait :
- ✅ Fonctionner normalement
- ✅ Utiliser le thème parent
- ✅ Aucun JavaScript moderne chargé
- ✅ Styles classiques uniquement

## Réactivation

Pour réactiver, remettez simplement :
```php
define( 'LILWEN54_MODERN_MODE', true );
```

