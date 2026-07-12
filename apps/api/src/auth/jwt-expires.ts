import { ConfigService } from '@nestjs/config';

const DEFAULT_JWT_EXPIRES_SECONDS = 900;
const DEFAULT_JWT_REFRESH_EXPIRES_SECONDS = 604800;

function resolveExpiresIn(
  config: ConfigService,
  envKey: string,
  fallbackSeconds: number,
): number {
  const seconds = config.get<string>(envKey)?.trim();

  if (seconds && /^\d+$/.test(seconds)) {
    return Number(seconds);
  }

  return fallbackSeconds;
}

export function resolveJwtExpiresIn(config: ConfigService): number {
  return resolveExpiresIn(config, 'JWT_EXPIRES', DEFAULT_JWT_EXPIRES_SECONDS);
}

export function resolveJwtRefreshExpiresIn(config: ConfigService): number {
  return resolveExpiresIn(
    config,
    'JWT_REFRESH_EXPIRES',
    DEFAULT_JWT_REFRESH_EXPIRES_SECONDS,
  );
}
