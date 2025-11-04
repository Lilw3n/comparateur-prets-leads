# 🎨 Guide : Appliquer l'Icône au Fichier .bat

## ✅ Icône Créée

L'icône ICO a été créée avec succès : `stream_ui\logo.ico`

Cette icône contient plusieurs tailles (16x16, 32x32, 48x48, 64x64, 128x128, 256x256 pixels) pour un affichage optimal.

---

## 🚀 Méthode 1 : Raccourci (Recommandé)

Un raccourci a été créé automatiquement avec l'icône.

**Avantage** : L'icône s'affiche directement sur le raccourci.

**Emplacement** : `Gestionnaire de Streams.lnk` (dans le dossier du projet)

---

## 🔧 Méthode 2 : Appliquer au Fichier .bat Directement

### Windows 10/11

1. **Clic droit** sur `start_stream_manager.bat`
2. **Propriétés**
3. **Onglet "Raccourci"** (si disponible)
4. **Cliquez sur "Changer l'icône..."**
5. **Naviguez** vers `stream_ui\logo.ico`
6. **Sélectionnez** le fichier
7. **OK** → **Appliquer** → **OK**

**Note** : Sur certains systèmes, les fichiers .bat ne peuvent pas avoir d'icône personnalisée directement. Dans ce cas, utilisez la **Méthode 1** (raccourci).

---

## 🛠️ Méthode 3 : Script Automatique

Exécutez le script :

```powershell
.\apply_icon.bat
```

Ce script crée automatiquement un raccourci avec l'icône personnalisée.

---

## 📋 Vérification

### Vérifier que l'Icône Est Appliquée

1. **Explorateur Windows**
   - Le raccourci devrait afficher l'icône avec les engrenages
   - L'icône devrait avoir un fond violet/indigo avec des engrenages

2. **Barre des Tâches**
   - Si vous épinglez le raccourci, l'icône devrait s'afficher correctement

---

## 🔄 Re-créer l'Icône

Si vous modifiez le logo SVG et voulez mettre à jour l'icône :

```powershell
python create_icon.py
```

Puis réappliquez l'icône avec :

```powershell
.\apply_icon.bat
```

---

## ❓ Dépannage

### Problème : "Changer l'icône" n'est pas disponible

**Solution** : Utilisez la méthode du raccourci (Méthode 1). Les fichiers .bat n'acceptent pas toujours les icônes personnalisées directement.

### Problème : L'icône ne s'affiche pas

**Solutions** :
1. **Rafraîchir** l'explorateur (F5)
2. **Redémarrer** l'explorateur Windows
3. **Vérifier** que le fichier `stream_ui\logo.ico` existe
4. **Recréer** l'icône : `python create_icon.py`

### Problème : "Module cairosvg non trouvé"

**Solution** :
```powershell
pip install Pillow cairosvg
python create_icon.py
```

---

## 📝 Résumé

✅ **Icône créée** : `stream_ui\logo.ico`  
✅ **Raccourci créé** : `Gestionnaire de Streams.lnk`  
✅ **Icône appliquée** automatiquement au raccourci

**Utilisez le raccourci** au lieu du fichier .bat pour voir l'icône personnalisée !



