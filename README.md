# Blog CMS - Monorepo

Este es un monorepo para un sistema de gestión de contenidos (CMS) de blog, utilizando una arquitectura moderna y escalable.

## Estructura del Proyecto

- **apps/api**: Backend desarrollado con [NestJS](https://nestjs.com/).
- **apps/web**: Frontend desarrollado con [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) y [Vite](https://vitejs.dev/).
- **infra**: Configuración de infraestructura (Docker).

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (gestor de paquetes recomendado)

## Instalación y Ejecución rápida

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Ejecutar en modo desarrollo (ambos proyectos a la vez):**
   ```bash
   pnpm dev
   ```

El backend estará disponible en `http://localhost:3000` y el frontend en `http://localhost:5173`.

## Otros comandos útiles

- `pnpm dev:api`: Inicia solo el backend.
- `pnpm dev:web`: Inicia solo el frontend.
- `pnpm build`: Compila ambos proyectos para producción.
- `pnpm format`: Formatea el código de todo el monorepo.
