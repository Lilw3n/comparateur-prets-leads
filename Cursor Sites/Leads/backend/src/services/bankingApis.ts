import axios from 'axios';

/**
 * Service d'intégration avec les API bancaires françaises
 * Supporte plusieurs types d'API : Open Banking, Simulation, Scoring
 */

interface BankingApiConfig {
  tinkApiKey?: string;
  bridgeApiKey?: string;
  openCreditsApiKey?: string;
  enableRealApis?: boolean;
}

const config: BankingApiConfig = {
  tinkApiKey: process.env.TINK_API_KEY,
  bridgeApiKey: process.env.BRIDGE_API_KEY,
  openCreditsApiKey: process.env.OPEN_CREDITS_API_KEY,
  enableRealApis: process.env.ENABLE_REAL_BANKING_APIS === 'true'
};

/**
 * 1. API Tink - Open Banking (accès aux données bancaires françaises)
 * Permet de récupérer les comptes, transactions pour scoring de crédit
 */
export async function fetchBankingDataTink(accessToken: string) {
  if (!config.enableRealApis || !config.tinkApiKey) {
    console.log('Tink API non configurée, utilisation de données mockées');
    return mockBankingData();
  }

  try {
    // API Tink pour récupérer les comptes
    const accountsResponse = await axios.get('https://api.tink.com/api/v1/accounts/list', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // API Tink pour récupérer les transactions
    const transactionsResponse = await axios.get('https://api.tink.com/api/v1/transactions/list', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: 100 // Dernières 100 transactions
      }
    });

    return {
      accounts: accountsResponse.data.accounts || [],
      transactions: transactionsResponse.data.transactions || [],
      balance: calculateTotalBalance(accountsResponse.data.accounts || []),
      monthlyIncome: calculateMonthlyIncome(transactionsResponse.data.transactions || []),
      monthlyExpenses: calculateMonthlyExpenses(transactionsResponse.data.transactions || [])
    };
  } catch (error: any) {
    console.error('Error fetching Tink banking data:', error.response?.data || error.message);
    return mockBankingData();
  }
}

/**
 * 2. API Bridge - Vérification IBAN et scoring
 */
export async function verifyIBANBridge(iban: string) {
  if (!config.enableRealApis || !config.bridgeApiKey) {
    return { valid: true, bank: 'Mock Bank', country: 'FR' };
  }

  try {
    const response = await axios.post('https://api.bridgeapi.io/v2/iban/validate', {
      iban
    }, {
      headers: {
        'Authorization': `Bearer ${config.bridgeApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      valid: response.data.valid,
      bank: response.data.bank?.name,
      country: response.data.country
    };
  } catch (error: any) {
    console.error('Error verifying IBAN with Bridge:', error.response?.data || error.message);
    return { valid: true, bank: 'Unknown', country: 'FR' };
  }
}

/**
 * 3. API de simulation de crédit (exemple avec structure générique)
 * Peut être adaptée pour OpenCrédits ou autres API similaires
 */
export async function simulateLoanOpenCredits(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  revenus?: number;
  charges?: number;
}) {
  if (!config.enableRealApis || !config.openCreditsApiKey) {
    console.log('OpenCredits API non configurée, utilisation de simulation locale');
    return mockLoanSimulation(params);
  }

  try {
    // Exemple de structure pour une API de simulation
    const response = await axios.post('https://api.opencrédits.fr/v1/simulate', {
      amount: params.montant,
      duration: params.duree,
      loanType: params.typeCredit,
      monthlyIncome: params.revenus,
      monthlyExpenses: params.charges
    }, {
      headers: {
        'Authorization': `Bearer ${config.openCreditsApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      offers: response.data.offers || [],
      bestRate: response.data.bestRate,
      averageRate: response.data.averageRate,
      eligibility: response.data.eligibility
    };
  } catch (error: any) {
    console.error('Error simulating loan with OpenCredits:', error.response?.data || error.message);
    return mockLoanSimulation(params);
  }
}

/**
 * 4. Calcul de scoring de crédit basé sur les données bancaires
 */
export function calculateCreditScore(bankingData: any, loanParams: {
  montant: number;
  duree: number;
  revenus?: number;
}) {
  let score = 50; // Score de base

  // Facteurs positifs
  if (bankingData.monthlyIncome && bankingData.monthlyIncome > 3000) {
    score += 15;
  }
  if (bankingData.balance && bankingData.balance > 10000) {
    score += 10;
  }
  if (bankingData.monthlyExpenses && bankingData.monthlyExpenses < bankingData.monthlyIncome * 0.5) {
    score += 15;
  }

  // Facteurs négatifs
  const debtRatio = bankingData.monthlyExpenses && bankingData.monthlyIncome
    ? bankingData.monthlyExpenses / bankingData.monthlyIncome
    : 0.5;

  if (debtRatio > 0.7) {
    score -= 20;
  } else if (debtRatio > 0.5) {
    score -= 10;
  }

  // Ratio prêt/revenus
  if (loanParams.revenus) {
    const monthlyPayment = calculateMonthlyPayment(loanParams.montant, loanParams.duree, 3.5);
    const loanRatio = monthlyPayment / loanParams.revenus;
    
    if (loanRatio > 0.35) {
      score -= 15;
    } else if (loanRatio < 0.25) {
      score += 10;
    }
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * 5. Récupération des taux du marché en temps réel
 * Peut utiliser des API de données financières ou scraper des sites réglementés
 */
export async function fetchMarketRates(typeCredit: string = 'immobilier') {
  try {
    // Exemple : utiliser une API de données financières (ex: Banque de France, sites réglementés)
    // Pour l'instant, on utilise des données mockées mais structurées
    
    const baseRates: Record<string, number> = {
      'immobilier': 3.2,
      'consommation': 4.5,
      'professionnel': 3.8
    };

    // Simulation de variation selon la durée
    const rates = {
      '15': baseRates[typeCredit] || 3.2,
      '20': (baseRates[typeCredit] || 3.2) + 0.2,
      '25': (baseRates[typeCredit] || 3.2) + 0.4,
      '30': (baseRates[typeCredit] || 3.2) + 0.6
    };

    return {
      typeCredit,
      rates,
      lastUpdate: new Date().toISOString(),
      source: 'Market Data'
    };
  } catch (error) {
    console.error('Error fetching market rates:', error);
    return null;
  }
}

// Fonctions utilitaires
function calculateTotalBalance(accounts: any[]): number {
  return accounts.reduce((total, account) => {
    return total + (account.balance?.amount?.value || 0);
  }, 0);
}

function calculateMonthlyIncome(transactions: any[]): number {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  return transactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= lastMonth && t.amount?.value > 0;
    })
    .reduce((total, t) => total + (t.amount?.value || 0), 0);
}

function calculateMonthlyExpenses(transactions: any[]): number {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  return Math.abs(transactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= lastMonth && t.amount?.value < 0;
    })
    .reduce((total, t) => total + (t.amount?.value || 0), 0));
}

function calculateMonthlyPayment(montant: number, dureeMois: number, taux: number): number {
  const tauxMensuel = taux / 100 / 12;
  if (tauxMensuel === 0) {
    return montant / dureeMois;
  }
  return montant * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -dureeMois)));
}

// Données mockées pour fallback
function mockBankingData() {
  return {
    accounts: [
      { id: '1', name: 'Compte Courant', balance: { amount: { value: 5000 } } },
      { id: '2', name: 'Livret A', balance: { amount: { value: 15000 } } }
    ],
    transactions: [],
    balance: 20000,
    monthlyIncome: 3500,
    monthlyExpenses: 1500
  };
}

function mockLoanSimulation(params: {
  montant: number;
  duree: number;
  typeCredit: string;
}) {
  const tauxBase = params.typeCredit === 'immobilier' ? 3.2 : 4.5;
  
  return {
    offers: [
      {
        bank: 'Banque Partenaire 1',
        rate: tauxBase,
        monthlyPayment: calculateMonthlyPayment(params.montant, params.duree, tauxBase),
        totalCost: calculateMonthlyPayment(params.montant, params.duree, tauxBase) * params.duree - params.montant
      },
      {
        bank: 'Banque Partenaire 2',
        rate: tauxBase + 0.2,
        monthlyPayment: calculateMonthlyPayment(params.montant, params.duree, tauxBase + 0.2),
        totalCost: calculateMonthlyPayment(params.montant, params.duree, tauxBase + 0.2) * params.duree - params.montant
      }
    ],
    bestRate: tauxBase,
    averageRate: tauxBase + 0.1,
    eligibility: { eligible: true, score: 75 }
  };
}

export default {
  fetchBankingDataTink,
  verifyIBANBridge,
  simulateLoanOpenCredits,
  calculateCreditScore,
  fetchMarketRates
};
