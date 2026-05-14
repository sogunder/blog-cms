import api from './api';
import type { Tag } from '../types';

export const tagService = {
  // Public
  async getTags(): Promise<Tag[]> {
    const { data } = await api.get('/tags');
    return data;
  },

  // Admin
  async getAdminTags(): Promise<Tag[]> {
    const { data } = await api.get('/admin/tags');
    return data;
  },

  async createTag(tagData: any): Promise<Tag> {
    const { data } = await api.post('/admin/tags', tagData);
    return data;
  },

  async updateTag(id: string, tagData: any): Promise<Tag> {
    const { data } = await api.patch(`/admin/tags/${id}`, tagData);
    return data;
  },

  async deleteTag(id: string): Promise<void> {
    await api.delete(`/admin/tags/${id}`);
  },
};
