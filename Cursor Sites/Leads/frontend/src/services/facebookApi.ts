import axios from 'axios';

const API_URL = '/api/facebook';

export interface FacebookPage {
  id: string;
  pageId: string;
  pageName: string;
  category?: string;
  followers: number;
  active: boolean;
}

export interface FacebookPost {
  id: string;
  pageId: string;
  facebookPostId?: string;
  articleId?: string;
  message: string;
  link?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  published: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface FacebookLead {
  id: string;
  facebookLeadId: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  adName?: string;
  formName?: string;
  imported: boolean;
  leadId?: string;
  createdAt: string;
}

export const facebookApi = {
  connectPage: async (data: {
    pageId: string;
    pageName: string;
    accessToken: string;
    category?: string;
  }) => {
    const response = await axios.post(`${API_URL}/connect`, data);
    return response.data;
  },

  publishPost: async (data: {
    pageId: string;
    message: string;
    link?: string;
    imageUrl?: string;
    articleId?: string;
    scheduledAt?: string;
  }) => {
    const response = await axios.post(`${API_URL}/posts`, data);
    return response.data;
  },

  getPosts: async (params?: { pageId?: string; published?: boolean }) => {
    const response = await axios.get(`${API_URL}/posts`, { params });
    return response.data;
  },

  syncPostMetrics: async (postId: string) => {
    const response = await axios.post(`${API_URL}/posts/${postId}/sync`);
    return response.data;
  },

  getLeads: async (params?: { pageId?: string; imported?: boolean }) => {
    const response = await axios.get(`${API_URL}/leads`, { params });
    return response.data;
  },

  importLead: async (leadId: string) => {
    const response = await axios.post(`${API_URL}/leads/${leadId}/import`);
    return response.data;
  }
};
