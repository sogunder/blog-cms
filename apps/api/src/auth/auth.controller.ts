import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Return JWT access token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  signIn(@Body() dto: LoginDto) {
    return this.auth.signIn(dto.email, dto.password);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  register(@Body() registerDto: RegisterDto) {
    return this.auth.register(registerDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user data' })
  getProfile(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @ApiBearerAuth()
  @Get('verify')
  @ApiOperation({ summary: 'Verify current JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  verifyToken(@CurrentUser() user: JwtPayload) {
    return {
      valid: true,
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  logout(@CurrentUser() user: JwtPayload) {
    return this.auth.logout(user.sub);
  }
}