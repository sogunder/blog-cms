import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwt: JwtService) {}

  async sign(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      return await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Access token inválido o expirado');
    }
  }
}
