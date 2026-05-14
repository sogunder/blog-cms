import { useEffect } from 'react';
import { useAuthStore } from '../app/store/useAuthStore';
import { authService } from '../services/auth.service';

/** Tras hidratar el store persistido, valida el JWT con el backend. */
export function AuthSessionSync() {
  useEffect(() => {
    const sync = async () => {
      await useAuthStore.persist.rehydrate();
      const { token, logout, setAuth } = useAuthStore.getState();
      if (!token) return;
      try {
        const res = await authService.verify();
        if (res.valid) setAuth(res.user, token);
        else logout();
      } catch {
        logout();
      }
    };
    void sync();
  }, []);
  return null;
}
