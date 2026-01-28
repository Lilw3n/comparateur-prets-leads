import axios from 'axios';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface ContactRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeDemande: 'BIEN' | 'PRET' | 'ASSURANCE';
  message?: string;
  montant?: number;
  duree?: number;
  typeBien?: string;
  typeAssurance?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  leadId?: string;
  emailSent: boolean;
}

export const contactService = {
  sendContact: async (data: ContactRequest): Promise<ContactResponse> => {
    const response = await axios.post<ContactResponse>(`${API_BASE_URL}/contact`, data);
    return response.data;
  },

  health: async () => {
    const response = await axios.get(`${API_BASE_URL}/contact/health`);
    return response.data;
  },
};

export default contactService;
