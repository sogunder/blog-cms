import { useEffect } from 'react';
import { useAuthStore } from '../app/store/useAuthStore';
import { refreshAccessToken } from '../services/api';
import { authService } from '../services/auth.service';

const AUTH_STORAGE_KEY = 'auth-storage';

/** Tras hidratar el store persistido, valida el JWT con el backend o renueva con refresh token. */
export function AuthSessionSync() {
  useEffect(() => {
    const sync = async () => {
      await useAuthStore.persist.rehydrate();
      const { token, refreshToken, logout, setAuth } = useAuthStore.getState();

      if (!token && !refreshToken) {
        useAuthStore.setState({ hasHydrated: true });
        return;
      }

      try {
        if (!token && refreshToken) {
          await refreshAccessToken();
        }

        const res = await authService.verify();
        if (res.valid) {
          const state = useAuthStore.getState();
          setAuth(res.user, state.token ?? '', state.refreshToken ?? '');
          return;
        }

        logout();
      } catch {
        logout();
      } finally {
        useAuthStore.setState({ hasHydrated: true });
      }
    };
    void sync();
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== AUTH_STORAGE_KEY) return;
      void useAuthStore.persist.rehydrate();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null;
}
