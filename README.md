# Blog CMS - Monorepo

Este es un monorepo para un sistema de gestión de contenidos (CMS) de blog, utilizando una arquitectura moderna y escalable.

## Estructura del Proyecto

- **apps/api**: Backend desarrollado con [NestJS](https://nestjs.com/).
- **apps/web**: Frontend desarrollado con [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) y [Vite](https://vitejs.dev/).
- **infra**: Configuración de infraestructura (Docker).

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- **Corepack** (activado para gestionar la versión de pnpm):
  ```bash
  corepack enable
  ```

## Instalación y Ejecución rápida (en carpeta raiz)

1. **Levantar la base de datos (Docker):**
   Es necesario levantar la infraestructura (MongoDB) antes de ejecutar la aplicación o los seeders.
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Ejecutar seeders (poblar la base de datos):**
   Una vez levantada la base de datos, puedes insertar datos iniciales. 
   - `seed:users`: Crea el usuario base/administrador.
   - `seed:demo`: Puebla la base de datos con datos de prueba (posts, comentarios, categorías).
   
   Ejecútalos de forma secuencial:
   ```bash
   pnpm run seed:users && pnpm run seed:demo
   ```

4. **Ejecutar en modo desarrollo (ambos proyectos a la vez):**
   ```bash
   pnpm dev
   ```

El backend estará disponible en `http://localhost:3000` y el frontend en `http://localhost:5173`.

La documentacion de la api estara disponible en `http://localhost:3000/docs`.

## Otros comandos útiles

- `pnpm dev:api`: Inicia solo el backend.
- `pnpm dev:web`: Inicia solo el frontend.
- `pnpm build`: Compila ambos proyectos para producción.
- `pnpm format`: Formatea el código de todo el monorepo.
