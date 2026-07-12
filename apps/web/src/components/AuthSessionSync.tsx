import { useEffect } from 'react';
import { useAuthStore } from '../app/store/useAuthStore';
import { authService } from '../services/auth.service';

const AUTH_STORAGE_KEY = 'auth-storage';

/** Tras hidratar el store persistido, valida el JWT con el backend o renueva con refresh token. */
export function AuthSessionSync() {
  useEffect(() => {
    const sync = async () => {
      await useAuthStore.persist.rehydrate();
      const { token, refreshToken, logout, setAuth, setTokens } =
        useAuthStore.getState();

      try {
        if (token) {
          const res = await authService.verify();
          if (res.valid) {
            setAuth(res.user, token, refreshToken ?? '');
            return;
          }
        }

        if (refreshToken) {
          const refreshed = await authService.refresh(refreshToken);
          setTokens(refreshed.access_token, refreshed.refresh_token);

          const res = await authService.verify();
          if (res.valid) {
            setAuth(res.user, refreshed.access_token, refreshed.refresh_token);
            return;
          }
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
