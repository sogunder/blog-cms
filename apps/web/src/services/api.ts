import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '../app/store/useAuthStore';
import type { RefreshResponse } from '../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL });

let refreshPromise: Promise<string> | null = null;

const AUTH_SKIP_REFRESH_PATHS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/revoke',
  '/auth/logout',
];

function shouldSkipRefresh(url: string): boolean {
  return AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path));
}

function setBearerToken(
  config: InternalAxiosRequestConfig,
  token: string,
): void {
  config.headers.set('Authorization', `Bearer ${token}`);
}

/** Renueva la sesión y actualiza el store. Todas las peticiones en espera comparten la misma promesa. */
export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const { refreshToken, user, setAuth, setTokens, logout } =
      useAuthStore.getState();

    if (!refreshToken) {
      logout();
      throw new Error('No refresh token');
    }

    try {
      const { data } = await axios.post<RefreshResponse>(
        `${baseURL}/auth/refresh`,
        { refreshToken },
      );

      if (user) {
        setAuth(user, data.access_token, data.refresh_token);
      } else {
        setTokens(data.access_token, data.refresh_token);
      }

      return data.access_token;
    } catch {
      logout();
      throw new Error('Refresh failed');
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    setBearerToken(config, token);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const url = String(originalRequest.url ?? '');

    if (shouldSkipRefresh(url)) {
      if (!url.includes('/auth/login')) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();
      setBearerToken(originalRequest, newToken);
      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  },
);

export default api;
