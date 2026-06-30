import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserRole } from '../common/enums';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import type {
  RefreshTokenPayload,
  RefreshTokenResponse,
} from './interfaces/refresh-token-payload.interface';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';

export type { JwtPayload } from './interfaces/jwt-payload.interface';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {

  private readonly refreshTokenSecret = 'refresh-secret-local-not-wired';
  private readonly refreshTokenExpiresInSeconds = 604800;
  private readonly revokedRefreshTokenIds = new Set<string>();
  private readonly activeRefreshTokens = new Set<string>();
  private readonly refreshTokensByUser = new Map<string, Set<string>>();

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<LoginResponse> {
    const user = await this.users.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const access_token = await this.jwt.signAsync(payload);
    await this.users.touchLastAccess(user.id);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(signUpDto: SignUpDto): Promise<LoginResponse> {
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

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const access_token = await this.jwt.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(userId: string) {
    return {
      message: 'Logout exitoso',
      userId,
      timestamp: new Date().toISOString(),
    };
  }

  async issueRefreshToken(userId: string): Promise<string> {
    const jti = randomUUID();
    const payload: RefreshTokenPayload = {
      sub: userId,
      type: 'refresh',
      jti,
    };

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiresInSeconds,
    });

    this.activeRefreshTokens.add(jti);

    const userTokens = this.refreshTokensByUser.get(userId) ?? new Set<string>();
    userTokens.add(jti);
    this.refreshTokensByUser.set(userId, userTokens);

    return refreshToken;
  }

  private verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
    try {
      const payload = this.jwt.verify<RefreshTokenPayload>(refreshToken, {
        secret: this.refreshTokenSecret,
      });

      if (payload.type !== 'refresh' || !payload.sub || !payload.jti) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      if (this.revokedRefreshTokenIds.has(payload.jti)) {
        throw new UnauthorizedException('Refresh token revocado');
      }

      if (!this.activeRefreshTokens.has(payload.jti)) {
        throw new UnauthorizedException('Refresh token no reconocido');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    const payload = this.verifyRefreshToken(refreshToken);
    const user = await this.users.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido');
    }

    await this.revokeRefreshToken(refreshToken);

    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const access_token = await this.jwt.signAsync(accessPayload);
    const refresh_token = await this.issueRefreshToken(user.id);

    return { access_token, refresh_token };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const payload = this.verifyRefreshToken(refreshToken);
    this.revokedRefreshTokenIds.add(payload.jti);
    this.activeRefreshTokens.delete(payload.jti);
  }

  async revokeAllRefreshTokensForUser(userId: string): Promise<void> {
    const jtis = this.refreshTokensByUser.get(userId);
    if (!jtis) {
      return;
    }

    for (const jti of jtis) {
      this.revokedRefreshTokenIds.add(jti);
      this.activeRefreshTokens.delete(jti);
    }

    this.refreshTokensByUser.delete(userId);
  }
}
