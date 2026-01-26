# 🎯 Système de Capture Automatique de Leads

## ✅ Fonctionnalités Implémentées

### 1. **Service de Capture** (`leadCapture.ts`)
- Capture depuis les simulateurs
- Capture depuis la recherche de biens
- Capture depuis le comparateur de prêts
- Capture depuis les téléchargements de guides/articles

### 2. **Formulaire de Capture** (`LeadCaptureForm.tsx`)
- Formulaire réutilisable avec validation
- Design moderne et responsive
- Gestion des erreurs
- Message de succès

### 3. **Intégrations Complètes**

#### ✅ Simulateur Capacité d'Emprunt
- Bouton "Recevoir mes résultats par email"
- Capture automatique avec toutes les données du simulateur
- Secteur: CREDIT_IMMOBILIER

#### ✅ Simulateur Mensualités
- Bouton "Recevoir mes résultats par email"
- Capture avec tableau d'amortissement
- Secteur: CREDIT_IMMOBILIER

#### ✅ Comparateur de Prêts
- Bouton "Demander" sur chaque offre
- Capture avec données de comparaison
- Secteur selon type de crédit (IMMOBILIER/CONSOMMATION/PROFESSIONNEL)

#### ✅ Recherche de Biens Immobiliers
- Nouvelle page `/recherche-biens`
- Formulaire de recherche complet
- Capture automatique après recherche
- Affichage de biens avec favoris
- Secteur: IMMOBILIER

## 📍 Où Trouver les Changements

### Pages avec Capture Automatique

1. **Simulateur Capacité d'Emprunt** (`/simulateurs/capacite-emprunt`)
   - Bouton vert "Recevoir mes résultats par email"
   - Formulaire s'affiche après clic

2. **Simulateur Mensualités** (`/simulateurs/mensualites`)
   - Bouton vert "Recevoir mes résultats par email"
   - Formulaire s'affiche après clic

3. **Comparateur de Prêts** (`/comparateur-prets`)
   - Bouton "Demander" sur chaque offre
   - Formulaire s'affiche après clic

4. **Recherche de Biens** (`/recherche-biens`)
   - Nouvelle page dans le menu "Crédit immobilier"
   - Formulaire de recherche avec filtres
   - Capture automatique après recherche
   - Bouton "En savoir plus" sur chaque bien

## 🎨 Comment Ça Fonctionne

### Flux de Capture

1. **Utilisateur utilise un outil** (simulateur, recherche, comparateur)
2. **Clique sur un bouton** ("Recevoir mes résultats", "Demander", etc.)
3. **Formulaire s'affiche** avec champs : Prénom, Nom, Email, Téléphone
4. **Utilisateur remplit le formulaire**
5. **Lead créé automatiquement** dans la base de données avec :
   - Coordonnées utilisateur
   - Données du simulateur/recherche/comparaison
   - Secteur approprié
   - Source (ex: "Simulateur capacité d'emprunt")
   - Notes détaillées

### Données Capturées

#### Depuis Simulateur Capacité d'Emprunt
- Revenus, charges, taux d'endettement
- Capacité d'emprunt calculée
- Mensualité maximale
- Taux et durée du prêt

#### Depuis Simulateur Mensualités
- Montant du bien, apport
- Taux, durée, assurance
- Mensualité calculée
- Tableau d'amortissement

#### Depuis Comparateur
- Montant, durée, type de crédit
- Apport, revenus
- Offres comparées
- Meilleure offre sélectionnée

#### Depuis Recherche de Biens
- Type de bien recherché
- Budget min/max
- Localisation
- Surface, nombre de pièces
- Critères de recherche

## 🚀 Utilisation

### Pour les Utilisateurs

1. Utilisez n'importe quel simulateur ou outil
2. Cliquez sur le bouton pour recevoir les résultats
3. Remplissez vos coordonnées
4. Recevez vos résultats par email
5. Être contacté par un conseiller

### Pour Vous (Gestion des Leads)

1. Allez sur la page **"Leads"**
2. Tous les leads capturés apparaissent automatiquement
3. Filtrez par secteur, statut, source
4. Exportez en CSV
5. Consultez les statistiques dans le Dashboard

## 📊 Statistiques Disponibles

- Nombre de leads par secteur
- Leads par source (simulateur, recherche, comparateur)
- Taux de conversion
- Leads récents
- Répartition par statut

## 🔧 Personnalisation

### Ajouter la Capture à un Nouveau Simulateur

```typescript
import LeadCaptureForm from '../components/LeadCaptureForm';
import LeadCaptureService from '../services/leadCapture';

// Dans votre composant
const [showCaptureForm, setShowCaptureForm] = useState(false);

const handleCaptureLead = async (data) => {
  await LeadCaptureService.captureFromSimulator(data.email, {
    secteur: Secteur.VOTRE_SECTEUR,
    simulatorType: 'votre_type',
    simulatorData: { /* vos données */ },
    source: 'Votre simulateur',
  });
};

// Dans le JSX
{showCaptureForm && (
  <LeadCaptureForm
    onCapture={handleCaptureLead}
    onClose={() => setShowCaptureForm(false)}
    title="Votre titre"
    description="Votre description"
  />
)}
```

## ✅ Avantages

✅ **Capture automatique** - Pas besoin de saisie manuelle
✅ **Données complètes** - Toutes les informations du simulateur
✅ **Secteurs appropriés** - Classification automatique
✅ **Sources tracées** - Savoir d'où viennent les leads
✅ **Interface intuitive** - Formulaire simple et clair
✅ **Multi-secteurs** - Fonctionne pour tous les secteurs

## 🎯 Résultat

**Chaque action utilisateur génère automatiquement un lead qualifié dans votre base de données !**

- ✅ Utilisation simulateur → Lead capturé
- ✅ Recherche de bien → Lead capturé
- ✅ Comparaison de prêts → Lead capturé
- ✅ Téléchargement guide → Lead capturé (à venir)
- ✅ Consultation article → Lead capturé (à venir)

**Votre base de leads se remplit automatiquement !** 🚀
