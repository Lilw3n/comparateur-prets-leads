import axios from 'axios';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const dossiersApi = axios.create({
  baseURL: `${API_BASE_URL}/dossiers`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DossierPret {
  id: string;
  identifiant: string;
  gestionnaireDossier: boolean;
  typePret: string;
  montantSouhaite: number;
  dureeSouhaitee: number;
  apportPersonnel?: number;
  finalite?: string;
  natureBien?: string;
  travaux: boolean;
  emprunteurCivilite: string;
  emprunteurNom: string;
  emprunteurPrenom: string;
  emprunteurEmail: string;
  emprunteurTelephone?: string;
  statut: string;
  leadId?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Pour les autres champs
}

export const dossiersService = {
  getAll: async (params?: { statut?: string; email?: string; typePret?: string }): Promise<DossierPret[]> => {
    const response = await dossiersApi.get<DossierPret[]>('/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<DossierPret> => {
    const response = await dossiersApi.get<DossierPret>(`/${id}`);
    return response.data;
  },

  getByIdentifiant: async (identifiant: string): Promise<DossierPret> => {
    const response = await dossiersApi.get<DossierPret>(`/identifiant/${identifiant}`);
    return response.data;
  },

  getByEmail: async (email: string): Promise<DossierPret[]> => {
    const response = await dossiersApi.get<DossierPret[]>(`/email/${email}`);
    return response.data;
  },

  getByStatut: async (statut: string): Promise<DossierPret[]> => {
    const response = await dossiersApi.get<DossierPret[]>(`/statut/${statut}`);
    return response.data;
  },

  create: async (data: any): Promise<DossierPret> => {
    const response = await dossiersApi.post<DossierPret>('/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<DossierPret>): Promise<DossierPret> => {
    const response = await dossiersApi.put<DossierPret>(`/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await dossiersApi.delete(`/${id}`);
  },
};

export default dossiersService;
