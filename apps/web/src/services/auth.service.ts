import api from './api';
import type { User, AuthResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', credentials);
    return {
      user: data.user,
      token: data.access_token,
    };
  },

  async verify(): Promise<{ valid: boolean; user: User }> {
    const { data } = await api.get<{ valid: boolean; user: User }>('/auth/verify');
    return { valid: data.valid, user: data.user };
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
  const response = await api.post('/auth/signup', data);
  return response.data;
}
};
