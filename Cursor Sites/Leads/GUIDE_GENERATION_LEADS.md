# 🚀 Guide de Génération de Leads Multi-Secteurs

## 📋 Vue d'ensemble

Le système de génération de leads vous permet de créer automatiquement des leads réalistes dans **tous les secteurs** de votre activité, et bien plus encore !

## 🎯 Secteurs Disponibles

### Vos Secteurs Principaux
- **Immobilier** - Achat, vente, location
- **Assurance** - Tous types d'assurances
- **Banque - Prêts** - Prêts bancaires
- **Marché financier** - Investissements financiers
- **Gestion de patrimoine** - Conseil en patrimoine
- **Investissement financier** - Placements financiers
- **Courtage assurance** - Courtage en assurance
- **Conseil financier** - Conseil en investissements

### Prêts Détaillés
- Crédit consommation
- Crédit immobilier
- Crédit professionnel

### Assurances Détaillées
- Assurance vie
- Assurance habitation
- Assurance auto
- Assurance santé
- Assurance VL

### Investissements
- SCPI
- PERP
- PEA
- Investissement locatif

### Fiscalité et Optimisation
- Défiscalisation
- Fiscalité
- Succession
- Donation

### Immobilier Détaillé
- LMNP
- Pinel
- Déficit foncier
- SCI

### Autres Secteurs
- Retraite
- Épargne
- Trading
- Crypto
- Entrepreneuriat
- Formation financière
- Conseil en patrimoine
- Mandat management
- Autre

**Total : 40+ secteurs disponibles !**

## 🎮 Comment Utiliser le Générateur

### 1. Accéder au Générateur

1. Allez sur la page **"Leads"** dans votre application
2. Cliquez sur le bouton **"Générer des Leads"** (vert avec l'icône ⚡)
3. Le panneau de génération s'affiche

### 2. Choisir le Mode de Génération

#### Mode "Un secteur"
- Sélectionnez un seul secteur
- Générez X leads pour ce secteur uniquement
- Idéal pour tester ou cibler un secteur spécifique

#### Mode "Plusieurs secteurs"
- Sélectionnez plusieurs secteurs (cochez les cases)
- Générez X leads par secteur sélectionné
- Idéal pour générer des leads dans vos secteurs d'activité

#### Mode "Tous les secteurs"
- Génère automatiquement pour tous les secteurs disponibles
- Générez X leads × 40+ secteurs = beaucoup de leads !
- Idéal pour maximiser votre base de données

### 3. Sélectionner les Secteurs

#### Sélection par Groupe
Les secteurs sont organisés en groupes pour faciliter la sélection :
- **Vos secteurs principaux** - Vos activités principales
- **Prêts** - Tous les types de crédits
- **Assurances** - Tous les types d'assurances
- **Investissements** - Placements financiers
- **Fiscalité** - Optimisation fiscale
- **Immobilier détaillé** - Dispositifs spécifiques
- **Autres** - Secteurs divers

#### Actions Rapides
- **"Tout sélectionner"** - Sélectionne tous les secteurs
- **"Tout désélectionner"** - Désélectionne tout
- **"Sélectionner tout"** (par groupe) - Sélectionne tous les secteurs d'un groupe

### 4. Définir le Nombre de Leads

- **Nombre par secteur** : Entre 1 et 1000
- **Recommandation** : 10-50 leads par secteur pour commencer
- **Exemple** : 10 leads × 40 secteurs = 400 leads au total

### 5. Générer les Leads

1. Cliquez sur **"Générer"**
2. Le système crée automatiquement des leads avec :
   - ✅ Noms et prénoms français réalistes
   - ✅ Emails uniques et valides
   - ✅ Numéros de téléphone français (90% des leads)
   - ✅ Entreprises françaises (30% des leads)
   - ✅ Sources variées (site web, réseaux sociaux, etc.)
   - ✅ Données spécifiques par secteur (budget, type de bien, etc.)

### 6. Vérifier les Résultats

Après génération, vous verrez :
- ✅ Nombre de leads générés avec succès
- ✅ Message de confirmation
- ✅ Les leads apparaissent automatiquement dans la liste

## 📊 Exemples d'Utilisation

### Exemple 1 : Générer pour vos secteurs principaux
```
Mode : Plusieurs secteurs
Secteurs sélectionnés :
- IMMOBILIER
- ASSURANCE
- BANQUE_PRET
- GESTION_PATRIMOINE
- CONSEIL_FINANCIER
Nombre : 20 leads par secteur
Résultat : 100 leads générés
```

### Exemple 2 : Générer pour tous les secteurs
```
Mode : Tous les secteurs
Nombre : 10 leads par secteur
Résultat : 400+ leads générés
```

### Exemple 3 : Cibler les crédits
```
Mode : Plusieurs secteurs
Secteurs sélectionnés :
- CREDIT_IMMOBILIER
- CREDIT_CONSOMMATION
- CREDIT_PROFESSIONNEL
Nombre : 50 leads par secteur
Résultat : 150 leads générés
```

## 🎨 Données Générées

Chaque lead généré contient :

### Informations de Base
- **Nom** : Nom français réaliste
- **Prénom** : Prénom français réaliste
- **Email** : Email unique et valide (format varié)
- **Téléphone** : Numéro français (06 ou 07) - 90% des leads
- **Entreprise** : Entreprise française - 30% des leads
- **Source** : Source variée (site web, réseaux sociaux, etc.)

### Données Spécifiques par Secteur

#### Immobilier
- Budget : 100 000€ - 600 000€
- Type de bien : Appartement, Maison, Villa, Studio, Loft, Terrain

#### Crédits
- Montant crédit : Variable selon le type
- Type crédit : Immobilier, Consommation, Professionnel

#### Assurances
- Type assurance : Vie, Habitation, Auto, Santé, VL

#### Investissements
- Produit financier : SCPI, PEA, PERP

#### Pinel / LMNP
- Type bien : Appartement
- Budget : 100 000€ - 300 000€

## ⚙️ API Backend

Le générateur utilise les endpoints suivants :

### Générer pour un secteur
```http
POST /api/leads/generate/secteur
Body: {
  "secteur": "IMMOBILIER",
  "nombre": 10
}
```

### Générer pour plusieurs secteurs
```http
POST /api/leads/generate/multiples
Body: {
  "secteurs": ["IMMOBILIER", "ASSURANCE"],
  "nombreParSecteur": 10
}
```

### Générer pour tous les secteurs
```http
POST /api/leads/generate/tous
Body: {
  "nombreParSecteur": 10
}
```

### Lister les secteurs
```http
GET /api/leads/generate/secteurs
```

## 💡 Conseils d'Utilisation

1. **Commencez petit** : Testez avec 10-20 leads par secteur
2. **Ciblez vos secteurs** : Générez d'abord pour vos secteurs principaux
3. **Évitez les doublons** : Le système ignore automatiquement les emails en double
4. **Générez progressivement** : Ne générez pas tout d'un coup, testez d'abord
5. **Vérifiez les données** : Après génération, vérifiez quelques leads pour valider la qualité

## 🔧 Personnalisation

### Modifier les Données Générées

Pour personnaliser les données générées, modifiez le fichier :
```
backend/src/services/leadGenerator.ts
```

Vous pouvez :
- Ajouter des prénoms/noms
- Modifier les entreprises
- Ajuster les budgets/montants
- Changer les sources
- Personnaliser les données par secteur

## 📈 Statistiques

Après génération, consultez le **Dashboard** pour voir :
- Nombre total de leads par secteur
- Taux de conversion
- Leads récents
- Répartition par statut

## 🚨 Limitations

- **Maximum 1000 leads par secteur** en une seule génération
- **Maximum 100 leads par secteur** pour "Tous les secteurs"
- Les emails en double sont automatiquement ignorés
- Les données sont générées de manière aléatoire mais réaliste

## ✅ Avantages

✅ **Génération rapide** - Créez des centaines de leads en quelques secondes
✅ **Données réalistes** - Noms, emails, téléphones français authentiques
✅ **Multi-secteurs** - 40+ secteurs disponibles
✅ **Personnalisable** - Données spécifiques par secteur
✅ **Sécurisé** - Évite les doublons automatiquement
✅ **Interface intuitive** - Facile à utiliser

## 🎯 Cas d'Usage

1. **Démarrer une nouvelle activité** : Générez des leads pour tester votre marché
2. **Élargir votre portefeuille** : Explorez de nouveaux secteurs
3. **Formation** : Utilisez des leads générés pour former votre équipe
4. **Tests** : Testez vos processus avec des données réalistes
5. **Développement** : Remplissez votre base de données pour le développement

---

**Prêt à générer vos leads ?** 🚀

Allez sur la page **"Leads"** et cliquez sur **"Générer des Leads"** !
