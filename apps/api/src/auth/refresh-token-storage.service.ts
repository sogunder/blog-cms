import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenStorageService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokens: Model<RefreshTokenDocument>,
  ) {}

  async store(userId: string, jti: string, expiresAt: Date): Promise<void> {
    await this.refreshTokens.create({
      userId,
      jti,
      expiresAt,
      revokedAt: null,
    });
  }

  async findActiveByJti(jti: string): Promise<RefreshTokenDocument | null> {
    return this.refreshTokens
      .findOne({
        jti,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }

  async revoke(jti: string): Promise<void> {
    await this.refreshTokens
      .updateOne({ jti, revokedAt: null }, { revokedAt: new Date() })
      .exec();
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokens
      .updateMany(
        { userId, revokedAt: null },
        { revokedAt: new Date() },
      )
      .exec();
  }
}
