import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../common/enums';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { ConflictException } from '@nestjs/common';
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
}
