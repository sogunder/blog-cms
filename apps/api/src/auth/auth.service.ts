import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../common/enums';
import { UsersService } from '../users/users.service';
import { AccessTokenService } from './access-token.service';
import { SignUpDto } from './dto/sign-up.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import type { RefreshTokenResponse } from './interfaces/refresh-token-payload.interface';
import { RefreshTokenService } from './refresh-token.service';
import * as bcrypt from 'bcrypt';

export type { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthTokensResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly accessTokens: AccessTokenService,
    private readonly refreshTokens: RefreshTokenService,
  ) {}

  async signIn(email: string, password: string): Promise<AuthTokensResponse> {
    const user = await this.users.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.users.touchLastAccess(user.id);

    return this.issueTokensForUser(user);
  }

  async register(signUpDto: SignUpDto): Promise<AuthTokensResponse> {
    const existingUser = await this.users.findByEmail(signUpDto.email);

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const user = await this.users.create({
      email: signUpDto.email,
      name: signUpDto.name,
      password: signUpDto.password,
      role: UserRole.Editor,
    });

    return this.issueTokensForUser(user);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    const payload = await this.refreshTokens.verify(refreshToken);
    const user = await this.users.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido');
    }

    await this.refreshTokens.revoke(refreshToken);

    const access_token = await this.accessTokens.sign(this.toJwtPayload(user));
    const refresh_token = await this.refreshTokens.issue(user.id);

    return { access_token, refresh_token };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.refreshTokens.revoke(refreshToken);
  }

  async logout(userId: string) {
    await this.refreshTokens.revokeAllForUser(userId);

    return {
      message: 'Logout exitoso',
      userId,
      timestamp: new Date().toISOString(),
    };
  }

  private async issueTokensForUser(user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  }): Promise<AuthTokensResponse> {
    const access_token = await this.accessTokens.sign(this.toJwtPayload(user));
    const refresh_token = await this.refreshTokens.issue(user.id);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  private toJwtPayload(user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  }): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
