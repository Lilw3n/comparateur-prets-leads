import axios from 'axios';
import { Article, ArticlesResponse, ArticleStats, GenerateArticleRequest } from '../types/articles';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const articlesApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const articlesService = {
  // Get all articles with filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    categorie?: string;
    source?: string;
    published?: boolean;
    search?: string;
  }): Promise<ArticlesResponse> => {
    const response = await articlesApi.get<ArticlesResponse>('/articles', { params });
    return response.data;
  },

  // Get article by slug
  getBySlug: async (slug: string): Promise<Article> => {
    const response = await articlesApi.get<Article>(`/articles/${slug}`);
    return response.data;
  },

  // Generate article
  generate: async (request: GenerateArticleRequest): Promise<Article> => {
    const response = await articlesApi.post<Article>('/articles/generate', request);
    return response.data;
  },

  // Generate from lead ID
  generateFromLead: async (leadId: string): Promise<Article> => {
    const response = await articlesApi.post<Article>(`/articles/generate-from-lead/${leadId}`);
    return response.data;
  },

  // Generate from comparison ID
  generateFromComparison: async (comparisonId: string): Promise<Article> => {
    const response = await articlesApi.post<Article>(`/articles/generate-from-comparison/${comparisonId}`);
    return response.data;
  },

  // Get related articles
  getRelated: async (slug: string): Promise<Article[]> => {
    const response = await articlesApi.get<Article[]>(`/articles/related/${slug}`);
    return response.data;
  },

  // Increment views
  incrementViews: async (slug: string): Promise<{ views: number }> => {
    const response = await articlesApi.post<{ views: number }>(`/articles/${slug}/views`);
    return response.data;
  },

  // Like article
  likeArticle: async (slug: string): Promise<{ likes: number }> => {
    const response = await articlesApi.post<{ likes: number }>(`/articles/${slug}/like`);
    return response.data;
  },

  // Get statistics
  getStats: async (): Promise<ArticleStats> => {
    const response = await articlesApi.get<ArticleStats>('/articles/stats');
    return response.data;
  },

  // Update article
  update: async (id: string, data: Partial<Article>): Promise<Article> => {
    const response = await articlesApi.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  // Delete article
  delete: async (id: string): Promise<void> => {
    await articlesApi.delete(`/articles/${id}`);
  },
};

export default articlesService;
