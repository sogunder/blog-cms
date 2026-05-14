import api from './api';
import type { User } from '../types';
import type { PaginatedResult } from './post.service';

export const userService = {
  async getUsers(page = 1, limit = 10): Promise<PaginatedResult<User>> {
    const { data } = await api.get('/users', { params: { page, limit } });
    return data;
  },

  async getUser(id: string): Promise<User> {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async createUser(userData: any): Promise<User> {
    const { data } = await api.post('/users', userData);
    return data;
  },

  async updateUser(id: string, userData: any): Promise<User> {
    const { data } = await api.patch(`/users/${id}`, userData);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
