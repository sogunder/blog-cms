import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import type { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';
import { resolveJwtRefreshExpiresIn } from './jwt-expires';
import { RefreshTokenStorageService } from './refresh-token-storage.service';

@Injectable()
export class RefreshTokenService {
  private readonly secret: string;
  private readonly expiresInSeconds: number;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly storage: RefreshTokenStorageService,
  ) {
    this.secret = this.config.get<string>(
      'JWT_REFRESH_SECRET',
      'dev-refresh-secret-change-me',
    );
    this.expiresInSeconds = resolveJwtRefreshExpiresIn(this.config);
  }

  async issue(userId: string): Promise<string> {
    const jti = randomUUID();
    const expiresAt = new Date(Date.now() + this.expiresInSeconds * 1000);

    const payload: RefreshTokenPayload = {
      sub: userId,
      type: 'refresh',
      jti,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: this.secret,
      expiresIn: this.expiresInSeconds,
    });

    await this.storage.store(userId, jti, expiresAt);

    return token;
  }

  async verify(token: string): Promise<RefreshTokenPayload> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwt.verifyAsync<RefreshTokenPayload>(token, {
        secret: this.secret,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    if (payload.type !== 'refresh' || !payload.sub || !payload.jti) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const stored = await this.storage.findActiveByJti(payload.jti);

    if (!stored) {
      throw new UnauthorizedException('Refresh token revocado o expirado');
    }

    return payload;
  }

  async revoke(token: string): Promise<void> {
    const payload = await this.verify(token);
    await this.storage.revoke(payload.jti);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.storage.revokeAllForUser(userId);
  }
}
