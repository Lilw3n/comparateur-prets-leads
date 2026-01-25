import { Request, Response } from 'express';
import bankingApis from '../services/bankingApis';

/**
 * Contrôleur pour les API bancaires françaises
 */

export const getBankingData = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token requis' });
    }

    const bankingData = await bankingApis.fetchBankingDataTink(accessToken);
    
    res.json({
      success: true,
      data: bankingData
    });
  } catch (error: any) {
    console.error('Error fetching banking data:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données bancaires' });
  }
};

export const verifyIBAN = async (req: Request, res: Response) => {
  try {
    const { iban } = req.body;

    if (!iban) {
      return res.status(400).json({ error: 'IBAN requis' });
    }

    const result = await bankingApis.verifyIBANBridge(iban);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('Error verifying IBAN:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification de l\'IBAN' });
  }
};

export const simulateLoan = async (req: Request, res: Response) => {
  try {
    const { montant, duree, typeCredit, revenus, charges } = req.body;

    if (!montant || !duree || !typeCredit) {
      return res.status(400).json({ error: 'Montant, durée et type de crédit requis' });
    }

    const simulation = await bankingApis.simulateLoanOpenCredits({
      montant,
      duree,
      typeCredit,
      revenus,
      charges
    });
    
    res.json({
      success: true,
      simulation
    });
  } catch (error: any) {
    console.error('Error simulating loan:', error);
    res.status(500).json({ error: 'Erreur lors de la simulation du prêt' });
  }
};

export const getCreditScore = async (req: Request, res: Response) => {
  try {
    const { bankingData, loanParams } = req.body;

    if (!bankingData || !loanParams) {
      return res.status(400).json({ error: 'Données bancaires et paramètres de prêt requis' });
    }

    const score = bankingApis.calculateCreditScore(bankingData, loanParams);
    
    res.json({
      success: true,
      score,
      interpretation: getScoreInterpretation(score)
    });
  } catch (error: any) {
    console.error('Error calculating credit score:', error);
    res.status(500).json({ error: 'Erreur lors du calcul du score de crédit' });
  }
};

export const getMarketRates = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const typeCredit = (type as string) || 'immobilier';

    const rates = await bankingApis.fetchMarketRates(typeCredit);
    
    res.json({
      success: true,
      rates
    });
  } catch (error: any) {
    console.error('Error fetching market rates:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des taux du marché' });
  }
};

function getScoreInterpretation(score: number): string {
  if (score >= 80) {
    return 'Excellent profil, très bonnes chances d\'obtenir un crédit';
  } else if (score >= 65) {
    return 'Bon profil, bonnes chances d\'obtenir un crédit';
  } else if (score >= 50) {
    return 'Profil acceptable, chances modérées';
  } else {
    return 'Profil à améliorer, difficultés possibles pour obtenir un crédit';
  }
}
