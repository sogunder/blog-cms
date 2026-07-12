import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../app/store/useAuthStore';
import type { RefreshResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

let refreshPromise: Promise<string | null> | null = null;

const AUTH_SKIP_REFRESH_PATHS = ['/auth/login', '/auth/refresh', '/auth/revoke'];

function shouldSkipRefresh(url: string): boolean {
  return AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, user, setAuth, setTokens, logout } =
    useAuthStore.getState();

  if (!refreshToken) {
    logout();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = api
      .post<RefreshResponse>('/auth/refresh', { refreshToken })
      .then(({ data }) => {
        if (user) {
          setAuth(user, data.access_token, data.refresh_token);
        } else {
          setTokens(data.access_token, data.refresh_token);
        }
        return data.access_token;
      })
      .catch(() => {
        logout();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const url = String(originalRequest.url ?? '');

      if (!shouldSkipRefresh(url)) {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } else if (!url.includes('/auth/login')) {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
