import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enums';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  /** ObjectId del usuario en MongoDB */
  sub: string;
  username: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<LoginResponse> {
    const user = await this.users.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const access_token = await this.jwt.signAsync(payload);
    await this.users.touchLastAccess(user.id);
    console.log(payload, access_token);
    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async validateUser(payload: JwtPayload) {
    return this.users.findOne(payload.sub);
  }

  async logout(userId: string) {
    return {
      message: 'Logout exitoso',
      userId,
      timestamp: new Date().toISOString(),
    };
  }
}
