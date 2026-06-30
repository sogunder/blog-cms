import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export function resolveJwtExpiresIn(
  config: ConfigService,
): JwtSignOptions['expiresIn'] {
  const seconds = config.get<string>('JWT_EXPIRES')?.trim();

  if (seconds && /^\d+$/.test(seconds)) {
    return Number(seconds);
  }

  return config.get<string>('JWT_EXPIRES_IN', '7d') as JwtSignOptions['expiresIn'];
}
