import api from './api';
import type { Category } from '../types';

export const categoryService = {
  // Public
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get('/categories');
    return data;
  },

  // Admin
  async getAdminCategories(): Promise<Category[]> {
    const { data } = await api.get('/admin/categories');
    return data;
  },

  async createCategory(catData: any): Promise<Category> {
    const { data } = await api.post('/admin/categories', catData);
    return data;
  },

  async updateCategory(id: string, catData: any): Promise<Category> {
    const { data } = await api.patch(`/admin/categories/${id}`, catData);
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },
};
