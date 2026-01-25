import axios from 'axios';
import { Lead, LeadsResponse, StatsResponse } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leadsApi = {
  getAll: async (params?: {
    secteur?: string;
    statut?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<LeadsResponse> => {
    const response = await api.get<LeadsResponse>('/leads', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Lead> => {
    const response = await api.get<Lead>(`/leads/${id}`);
    return response.data;
  },

  create: async (lead: Partial<Lead>): Promise<Lead> => {
    const response = await api.post<Lead>('/leads', lead);
    return response.data;
  },

  update: async (id: string, lead: Partial<Lead>): Promise<Lead> => {
    const response = await api.put<Lead>(`/leads/${id}`, lead);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get<StatsResponse>('/leads/stats');
    return response.data;
  },

  export: async (params?: {
    secteur?: string;
    statut?: string;
    format?: string;
  }): Promise<Blob> => {
    const response = await api.get('/leads/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
