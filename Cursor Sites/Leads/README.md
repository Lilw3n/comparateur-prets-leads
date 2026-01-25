# Application de Gestion de Leads Multi-Secteurs

Application web complète pour générer, gérer et exporter des leads dans les secteurs de l'immobilier, de l'assurance, de la banque (prêts bancaires) et du marché financier.

## 🚀 Fonctionnalités

- ✅ Gestion complète des leads (CRUD)
- ✅ Filtrage et recherche avancée
- ✅ Tableau de bord avec statistiques
- ✅ Export CSV des leads
- ✅ Interface moderne et responsive
- ✅ Champs spécifiques par secteur
- ✅ **Comparateur de prêts multi-sources** (Pretto, Meilleur Taux, Meilleur Agents)
- ✅ **Affichage direct des taux moyens** (comme Meilleurtaux)
- ✅ Comparaison automatique des offres de prêts
- ✅ Calcul des mensualités et coûts totaux
- ✅ **Simulateur TAEG** pour ajuster manuellement les taux
- ✅ Questionnaire de qualification optionnel (6 étapes)
- ✅ Intégration d'APIs externes

## 📋 Prérequis

- Node.js 18+ et npm
- SQLite (pour le développement)

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm run install:all
```

2. Configurer la base de données :
```bash
cd backend
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run init:comparateurs
```

3. Démarrer l'application :
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:3002

## 📁 Structure du projet

```
leads/
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/      # Pages principales
│   │   ├── services/   # Services API
│   │   └── types/      # Types TypeScript
├── backend/           # API Node.js/Express
│   ├── src/
│   │   ├── routes/     # Routes API
│   │   ├── controllers/ # Contrôleurs
│   │   └── server.ts   # Serveur Express
└── prisma/            # Schéma de base de données
```

## 🎯 Pages principales

- `/` - Tableau de bord avec statistiques
- `/leads` - Gestion des leads
- `/comparateur` - Page d'accueil avec taux moyens affichés directement
- `/comparateur-prets` - Comparateur détaillé avec simulateur TAEG

## 📊 Secteurs supportés

1. **Immobilier** : Budget, type de bien
2. **Assurance** : Type d'assurance (vie, habitation, auto, santé)
3. **Banque - Prêts** : Type de crédit, montant
4. **Marché financier** : Produit financier

## 🎯 Statuts des leads

- **Nouveau** : Lead nouvellement créé
- **Contacté** : Lead contacté mais non converti
- **Converti** : Lead converti en client
- **Perdu** : Lead perdu/non intéressé

## 📝 API Endpoints

### Leads
- `GET /api/leads` : Liste des leads (avec filtres)
- `GET /api/leads/:id` : Détails d'un lead
- `POST /api/leads` : Créer un lead
- `PUT /api/leads/:id` : Modifier un lead
- `DELETE /api/leads/:id` : Supprimer un lead
- `GET /api/leads/stats` : Statistiques
- `GET /api/leads/export` : Export CSV

### Comparateurs
- `GET /api/comparateurs` : Liste des comparateurs
- `GET /api/offres` : Liste des offres
- `POST /api/comparer` : Comparer des prêts
- `GET /api/taux-moyens` : Obtenir les taux moyens par type de crédit
- `GET /api/meilleures-offres` : Meilleures offres

## 🗄️ Base de données

La base de données utilise Prisma avec SQLite pour le développement. Le schéma est défini dans `prisma/schema.prisma`.

Pour visualiser la base de données :
```bash
cd backend
npm run prisma:studio
```

## 🎨 Améliorations apportées

- **Page d'accueil moderne** avec taux moyens affichés directement (inspirée de Meilleurtaux)
- **Simulateur TAEG** pour ajuster manuellement les taux et tester des simulations
- **Questionnaire optionnel** en 6 étapes pour affiner les résultats
- **Comparaison automatique** au chargement de la page
- **Design amélioré** avec gradients, ombres et animations
- **Navigation fluide** entre les pages

## 📄 Licence

MIT
