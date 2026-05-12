# Taskboard Monorepo

A monorepo containing a NestJS API and a Vite React TypeScript frontend.

## Structure

- `apps/api`: NestJS backend
- `apps/web`: Vite React TypeScript frontend
- `infra`: Docker infrastructure

## Getting Started

1. Install dependencies: `pnpm install`
2. Start development: `pnpm dev`
3. Build: `pnpm build`
4. Lint: `pnpm lint`
5. Format: `pnpm format`

## Scripts

- `pnpm dev`: Start both API and web in development mode
- `pnpm dev:api`: Start API only
- `pnpm dev:web`: Start web only
- `pnpm build`: Build all apps
- `pnpm test`: Run tests
- `pnpm lint`: Lint all code
- `pnpm format`: Format code with Prettier

## Docker

Use `docker-compose up` in the `infra` directory to start MongoDB and Mongo Express.