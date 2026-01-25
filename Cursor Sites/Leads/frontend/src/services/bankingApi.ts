import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const bankingApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BankingData {
  accounts: any[];
  transactions: any[];
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface IBANVerification {
  valid: boolean;
  bank?: string;
  country?: string;
}

export interface LoanSimulation {
  offers: Array<{
    bank: string;
    rate: number;
    monthlyPayment: number;
    totalCost: number;
  }>;
  bestRate: number;
  averageRate: number;
  eligibility: {
    eligible: boolean;
    score: number;
  };
}

export interface CreditScore {
  score: number;
  interpretation: string;
}

export interface MarketRates {
  typeCredit: string;
  rates: Record<string, number>;
  lastUpdate: string;
  source: string;
}

/**
 * Service pour interagir avec les API bancaires françaises
 */
export const bankingApiService = {
  /**
   * Récupère les données bancaires d'un utilisateur (nécessite token Tink)
   */
  async getBankingData(accessToken: string): Promise<BankingData> {
    const response = await bankingApi.post('/banking/data', { accessToken });
    return response.data.data;
  },

  /**
   * Vérifie un IBAN
   */
  async verifyIBAN(iban: string): Promise<IBANVerification> {
    const response = await bankingApi.post('/banking/verify-iban', { iban });
    return response.data;
  },

  /**
   * Simule un prêt avec API externe
   */
  async simulateLoan(params: {
    montant: number;
    duree: number;
    typeCredit: string;
    revenus?: number;
    charges?: number;
  }): Promise<LoanSimulation> {
    const response = await bankingApi.post('/banking/simulate', params);
    return response.data.simulation;
  },

  /**
   * Calcule le score de crédit
   */
  async getCreditScore(bankingData: Partial<BankingData>, loanParams: {
    montant: number;
    duree: number;
    revenus?: number;
  }): Promise<CreditScore> {
    const response = await bankingApi.post('/banking/credit-score', {
      bankingData,
      loanParams
    });
    return {
      score: response.data.score,
      interpretation: response.data.interpretation
    };
  },

  /**
   * Récupère les taux du marché
   */
  async getMarketRates(typeCredit: string = 'immobilier'): Promise<MarketRates> {
    const response = await bankingApi.get('/banking/market-rates', {
      params: { type: typeCredit }
    });
    return response.data.rates;
  }
};

export default bankingApiService;
