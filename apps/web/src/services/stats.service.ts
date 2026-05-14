import api from './api';

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  pendingComments: number;
  totalViews: number;
}

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get('/admin/stats/dashboard');
    return data;
  },
};
