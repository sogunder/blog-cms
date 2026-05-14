/**
 * CLI: `pnpm seed:users` | `pnpm seed:demo` (desde raíz del monorepo o apps/api).
 * Requiere MONGODB_URI en .env o entorno (carga dotenv vía ConfigModule).
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DemoSeedService } from './demo-seed.service';
import { SeedCliModule } from './seed-cli.module';

async function main() {
  const cmd = process.argv[2];
  const app = await NestFactory.createApplicationContext(SeedCliModule, {
    logger: ['error', 'warn', 'log'],
  });
  const seed = app.get(DemoSeedService);
  try {
    if (cmd === 'users') {
      await seed.seedUsers();
    } else if (cmd === 'demo') {
      await seed.seedDemo();
    } else {
      // eslint-disable-next-line no-console
      console.error('Uso: pnpm seed:users | pnpm seed:demo');
      process.exitCode = 1;
    }
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
