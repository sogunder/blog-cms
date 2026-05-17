import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Al cambiar de ruta, sube la ventana al inicio.
 * También recorre los <main> con scroll propio (caso del panel admin).
 * Respeta el hash (#seccion) para anclas internas.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.querySelectorAll('main').forEach((el) => {
      el.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }, [pathname, hash]);

  return null;
};
