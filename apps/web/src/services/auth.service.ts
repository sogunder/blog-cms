import api from './api';
import type { User, AuthResponse } from '../types';

export const authService = {
  async login(credentials: any): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', credentials);
    return {
      user: data.user,
      token: data.access_token,
    };
  },

  async verify(): Promise<{ valid: boolean; user: User }> {
    const { data } = await api.get('/auth/verify');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
