import api from './api';
import { useAuthStore } from '../app/store/useAuthStore';
import type { User, AuthResponse, RefreshResponse } from '../types';

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
      refreshToken: data.refresh_token,
    };
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },

  async verify(): Promise<{ valid: boolean; user: User }> {
    const { data } = await api.get<{ valid: boolean; user: User }>(
      '/auth/verify',
    );
    return { valid: data.valid, user: data.user };
  },

  async logout(): Promise<void> {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return;

    await api.post('/auth/logout', { refreshToken });
  },

  async revoke(refreshToken: string): Promise<void> {
    await api.post('/auth/revoke', { refreshToken });
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
};
