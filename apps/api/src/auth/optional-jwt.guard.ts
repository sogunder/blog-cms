import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const header = request.headers.authorization;
    const [type, token] = header?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      return true;
    }
    try {
      request.user = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      /* token inválido: tratar como anónimo */
    }
    return true;
  }
}
