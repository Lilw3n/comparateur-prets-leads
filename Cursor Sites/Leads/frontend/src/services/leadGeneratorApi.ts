import axios from 'axios';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const leadGeneratorApi = axios.create({
  baseURL: `${API_BASE_URL}/leads/generate`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GenererLeadsSecteurRequest {
  secteur: string;
  nombre?: number;
}

export interface GenererLeadsMultiplesRequest {
  secteurs: string[];
  nombreParSecteur?: number;
}

export interface GenererLeadsTousRequest {
  nombreParSecteur?: number;
}

export interface GenererLeadsResponse {
  success: boolean;
  secteur?: string;
  generes: number;
  total?: number;
  resultats?: Array<{
    secteur: string;
    generes: number;
    total?: number;
  }>;
  message: string;
}

export interface SecteursResponse {
  success: boolean;
  secteurs: string[];
  total: number;
}

export const leadGeneratorService = {
  /**
   * Génère des leads pour un secteur spécifique
   */
  async genererPourSecteur(secteur: string, nombre: number = 10): Promise<GenererLeadsResponse> {
    const response = await leadGeneratorApi.post<GenererLeadsResponse>('/secteur', {
      secteur,
      nombre,
    });
    return response.data;
  },

  /**
   * Génère des leads pour plusieurs secteurs
   */
  async genererPourSecteurs(secteurs: string[], nombreParSecteur: number = 10): Promise<GenererLeadsResponse> {
    const response = await leadGeneratorApi.post<GenererLeadsResponse>('/multiples', {
      secteurs,
      nombreParSecteur,
    });
    return response.data;
  },

  /**
   * Génère des leads pour tous les secteurs
   */
  async genererPourTous(nombreParSecteur: number = 10): Promise<GenererLeadsResponse> {
    const response = await leadGeneratorApi.post<GenererLeadsResponse>('/tous', {
      nombreParSecteur,
    });
    return response.data;
  },

  /**
   * Liste tous les secteurs disponibles
   */
  async listerSecteurs(): Promise<SecteursResponse> {
    const response = await leadGeneratorApi.get<SecteursResponse>('/secteurs');
    return response.data;
  },
};

export default leadGeneratorService;
