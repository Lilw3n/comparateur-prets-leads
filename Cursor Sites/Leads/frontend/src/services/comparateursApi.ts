import axios from 'axios';
import {
  ComparateurPret,
  OffrePret,
  ComparaisonRequest,
  ComparaisonResponse,
  TauxMoyen
} from '../types/comparateurs';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const comparateursApi = {
  // Comparateurs
  getAllComparateurs: async (): Promise<ComparateurPret[]> => {
    const response = await api.get<ComparateurPret[]>('/comparateurs');
    return response.data;
  },

  getComparateurById: async (id: string): Promise<ComparateurPret> => {
    const response = await api.get<ComparateurPret>(`/comparateurs/${id}`);
    return response.data;
  },

  createComparateur: async (comparateur: Partial<ComparateurPret>): Promise<ComparateurPret> => {
    const response = await api.post<ComparateurPret>('/comparateurs', comparateur);
    return response.data;
  },

  updateComparateur: async (id: string, comparateur: Partial<ComparateurPret>): Promise<ComparateurPret> => {
    const response = await api.put<ComparateurPret>(`/comparateurs/${id}`, comparateur);
    return response.data;
  },

  deleteComparateur: async (id: string): Promise<void> => {
    await api.delete(`/comparateurs/${id}`);
  },

  // Offres
  getAllOffres: async (params?: {
    comparateurId?: string;
    typeCredit?: string;
    montantMin?: number;
    montantMax?: number;
    duree?: number;
    disponible?: boolean;
  }): Promise<OffrePret[]> => {
    const response = await api.get<OffrePret[]>('/offres', { params });
    return response.data;
  },

  createOffre: async (offre: Partial<OffrePret>): Promise<OffrePret> => {
    const response = await api.post<OffrePret>('/offres', offre);
    return response.data;
  },

  updateOffre: async (id: string, offre: Partial<OffrePret>): Promise<OffrePret> => {
    const response = await api.put<OffrePret>(`/offres/${id}`, offre);
    return response.data;
  },

  deleteOffre: async (id: string): Promise<void> => {
    await api.delete(`/offres/${id}`);
  },

  // Comparaison
  comparerPrets: async (request: ComparaisonRequest & { questionnaireData?: any }): Promise<ComparaisonResponse> => {
    const response = await api.post<ComparaisonResponse>('/comparer', request);
    return response.data;
  },

  getMeilleuresOffres: async (typeCredit?: string, limit?: number): Promise<OffrePret[]> => {
    const response = await api.get<OffrePret[]>('/meilleures-offres', {
      params: { typeCredit, limit }
    });
    return response.data;
  },

  // Taux moyens
  getTauxMoyens: async (duree?: number): Promise<TauxMoyen[]> => {
    const response = await api.get<TauxMoyen[]>('/taux-moyens', {
      params: { duree }
    });
    return response.data;
  },
};

export default api;
