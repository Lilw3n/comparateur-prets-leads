import axios from 'axios';

const API_URL = '/api/visits';

export interface VisitStats {
  period: string;
  totalVisits: number;
  uniqueVisits: number;
  topPages: Array<{ page: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
  deviceStats: Array<{ device: string; count: number }>;
  browserStats: Array<{ browser: string; count: number }>;
}

export interface DailyStat {
  date: string;
  total: number;
  unique: number;
  pages: Array<{ page: string; count: number }>;
}

export const visitsApi = {
  trackVisit: async (data: {
    sessionId: string;
    page: string;
    referrer?: string;
    userAgent?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
  }) => {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
  },

  getStats: async (period: 'all' | 'day' | 'week' | 'month' | 'year' = 'all'): Promise<VisitStats> => {
    const response = await axios.get<VisitStats>(`${API_URL}/stats`, {
      params: { period }
    });
    return response.data;
  },

  getDailyStats: async (days: number = 30): Promise<DailyStat[]> => {
    const response = await axios.get<DailyStat[]>(`${API_URL}/stats/daily`, {
      params: { days }
    });
    return response.data;
  }
};
