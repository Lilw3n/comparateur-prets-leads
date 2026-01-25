import express from 'express';
import {
  getBankingData,
  verifyIBAN,
  simulateLoan,
  getCreditScore,
  getMarketRates
} from '../controllers/bankingController';

const router = express.Router();

/**
 * Routes pour les API bancaires françaises
 */

// Récupérer les données bancaires (nécessite token d'accès)
router.post('/banking/data', getBankingData);

// Vérifier un IBAN
router.post('/banking/verify-iban', verifyIBAN);

// Simuler un prêt avec API externe
router.post('/banking/simulate', simulateLoan);

// Calculer le score de crédit
router.post('/banking/credit-score', getCreditScore);

// Récupérer les taux du marché
router.get('/banking/market-rates', getMarketRates);

export default router;
