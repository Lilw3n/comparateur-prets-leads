# Intégration API Bancaires Françaises

Ce document décrit l'intégration des API bancaires françaises dans le projet.

## 🏦 API Disponibles

### 1. **Tink API** - Open Banking
- **Usage** : Récupération des données bancaires (comptes, transactions)
- **Utilité** : Scoring de crédit, vérification de solvabilité
- **Documentation** : https://developers.tink.com/
- **Agrément requis** : Oui (AISP - Account Information Service Provider)

**Fonctionnalités** :
- Récupération des comptes bancaires
- Historique des transactions
- Calcul automatique des revenus/dépenses mensuels
- Balance totale

### 2. **Bridge API** - Vérification IBAN et Scoring
- **Usage** : Vérification d'IBAN, scoring de crédit
- **Utilité** : Validation des coordonnées bancaires, évaluation de crédit
- **Documentation** : https://bridgeapi.io/
- **Agrément requis** : Non (pour vérification IBAN)

**Fonctionnalités** :
- Vérification de validité d'un IBAN
- Identification de la banque
- Scoring de crédit basé sur les données bancaires

### 3. **OpenCredits API** - Simulation de Prêts
- **Usage** : Simulation et comparaison de prêts
- **Utilité** : Obtenir des offres réelles de prêts
- **Documentation** : À adapter selon le fournisseur
- **Agrément requis** : Dépend du fournisseur

**Fonctionnalités** :
- Simulation de prêts immobiliers/consommation
- Comparaison d'offres multiples
- Calcul d'éligibilité

## 🚀 Configuration

### 1. Variables d'environnement

Ajoutez dans `backend/.env` :

```env
# Activer les vraies API
ENABLE_REAL_BANKING_APIS=true

# Clés API
TINK_API_KEY=votre_cle_tink
BRIDGE_API_KEY=votre_cle_bridge
OPEN_CREDITS_API_KEY=votre_cle_opencrédits
```

### 2. Mode Fallback

Si les API ne sont pas configurées ou en cas d'erreur, le système utilise automatiquement des données mockées pour continuer à fonctionner.

## 📡 Endpoints Disponibles

### POST `/api/banking/data`
Récupère les données bancaires d'un utilisateur.

**Body** :
```json
{
  "accessToken": "token_d_acces_tink"
}
```

**Response** :
```json
{
  "success": true,
  "data": {
    "accounts": [...],
    "transactions": [...],
    "balance": 20000,
    "monthlyIncome": 3500,
    "monthlyExpenses": 1500
  }
}
```

### POST `/api/banking/verify-iban`
Vérifie un IBAN.

**Body** :
```json
{
  "iban": "FR7630006000011234567890189"
}
```

### POST `/api/banking/simulate`
Simule un prêt avec API externe.

**Body** :
```json
{
  "montant": 200000,
  "duree": 240,
  "typeCredit": "immobilier",
  "revenus": 3500,
  "charges": 1500
}
```

### POST `/api/banking/credit-score`
Calcule le score de crédit.

**Body** :
```json
{
  "bankingData": {
    "monthlyIncome": 3500,
    "monthlyExpenses": 1500,
    "balance": 20000
  },
  "loanParams": {
    "montant": 200000,
    "duree": 240,
    "revenus": 3500
  }
}
```

### GET `/api/banking/market-rates?type=immobilier`
Récupère les taux du marché.

## 🔐 Agréments et Conformité

### PSD2 / Open Banking
Pour utiliser les API Open Banking (Tink), vous devez :
1. Obtenir un agrément AISP (Account Information Service Provider)
2. Enregistrer votre application auprès de l'ACPR (Autorité de Contrôle Prudentiel et de Résolution)
3. Respecter le RGPD et les règles de consentement

### Alternative : Partenariats
Vous pouvez également :
- Partenarier avec des fintechs déjà agréées (Treezor, Swan)
- Utiliser des solutions BaaS (Banking as a Service)
- Intégrer via des courtiers en crédit agréés

## 💡 Améliorations Possibles

### Court terme (sans agrément)
1. ✅ Vérification IBAN (Bridge API - pas d'agrément requis)
2. ✅ Simulation locale améliorée avec données de marché
3. ✅ Scoring basé sur les données du questionnaire

### Moyen terme (avec partenariat)
1. Intégration avec un courtier agréé pour offres réelles
2. Utilisation d'une solution BaaS pour données bancaires
3. Partenariat avec une fintech pour scoring avancé

### Long terme (avec agrément)
1. Accès direct aux API PSD2 des banques françaises
2. Scoring automatique basé sur données bancaires réelles
3. Workflow complet de demande de prêt

## 🧪 Test

Pour tester sans vraies API :
```bash
# Les données mockées seront utilisées automatiquement
ENABLE_REAL_BANKING_APIS=false npm run dev
```

Pour tester avec vraies API :
```bash
# Configurez vos clés API dans .env
ENABLE_REAL_BANKING_APIS=true npm run dev
```

## 📚 Ressources

- [Tink Developer Portal](https://developers.tink.com/)
- [Bridge API Documentation](https://bridgeapi.io/docs)
- [PSD2 en France](https://www.banque-france.fr/reglementation/psd2)
- [ACPR - Agréments](https://acpr.banque-france.fr/)
