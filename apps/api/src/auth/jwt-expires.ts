import { ConfigService } from '@nestjs/config';

const DEFAULT_JWT_EXPIRES_SECONDS = 604800;

export function resolveJwtExpiresIn(config: ConfigService): number {
  const seconds = config.get<string>('JWT_EXPIRES')?.trim();

  if (seconds && /^\d+$/.test(seconds)) {
    return Number(seconds);
  }

  return DEFAULT_JWT_EXPIRES_SECONDS;
}
