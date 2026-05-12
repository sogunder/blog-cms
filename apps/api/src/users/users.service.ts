import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '../common/enums';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import {
  hashUserPassword,
  isBcryptPasswordHash,
} from './users.crypto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    await this.migrateLegacyPasswordFields();
  }

  /**
   * - Renombra `password` → `passwordHash` (datos viejos).
   * - Elimina `password` si ya existe `passwordHash`.
   * - Si `passwordHash` no parece bcrypt, asume texto plano y lo sustituye por hash.
   */
  private async migrateLegacyPasswordFields() {
    const coll = this.users.collection;

    const renamed = await coll.updateMany(
      { passwordHash: { $exists: false }, password: { $exists: true } },
      [{ $set: { passwordHash: '$password' } }, { $unset: 'password' }],
    );
    if (renamed.modifiedCount > 0) {
      this.logger.log(
        `Migración: campo password → passwordHash en ${renamed.modifiedCount} documento(s)`,
      );
    }

    const droppedDup = await coll.updateMany(
      { password: { $exists: true }, passwordHash: { $exists: true } },
      { $unset: { password: '' } },
    );
    if (droppedDup.modifiedCount > 0) {
      this.logger.log(
        `Migración: eliminado password duplicado en ${droppedDup.modifiedCount} documento(s)`,
      );
    }

    const needsRehash = await this.users
      .find({ passwordHash: { $exists: true, $nin: [null, ''] } })
      .select('+passwordHash')
      .lean()
      .exec();

    let rehashed = 0;
    for (const doc of needsRehash) {
      const raw = doc.passwordHash;
      if (typeof raw !== 'string' || isBcryptPasswordHash(raw)) {
        continue;
      }
      const passwordHash = await hashUserPassword(raw);
      await this.users.updateOne({ _id: doc._id }, { $set: { passwordHash } });
      rehashed += 1;
    }
    if (rehashed > 0) {
      this.logger.log(
        `Migración: ${rehashed} contraseña(s) en texto plano sustituida(s) por hash bcrypt`,
      );
    }
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await hashUserPassword(dto.password);
    try {
      const doc = await this.users.create({
        username: dto.username.trim().toLowerCase(),
        passwordHash,
        role: UserRole.User,
        lastAccess: null,
      });
      return this.findPublicById(doc.id);
    } catch (e) {
      this.throwIfDuplicateUsername(e);
      throw e;
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      this.users.countDocuments().exec(),
      this.users
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);
    return {
      data: rows as User[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.findPublicById(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: Record<string, unknown> = {};

    if (dto.username !== undefined) {
      data.username = dto.username.trim().toLowerCase();
    }
    if (dto.password !== undefined) {
      data.passwordHash = await hashUserPassword(dto.password);
    }
    if (dto.lastAccess !== undefined) {
      data.lastAccess = new Date(dto.lastAccess);
    }
    if (dto.role !== undefined) {
      data.role = dto.role;
    }

    if (Object.keys(data).length === 0) {
      return this.findPublicById(id);
    }

    try {
      const updated = await this.users
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .select('-passwordHash')
        .lean()
        .exec();

      if (!updated) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return updated;
    } catch (e) {
      this.throwIfDuplicateUsername(e);
      throw e;
    }
  }

  async remove(id: string) {
    const deleted = await this.users.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return { ok: true };
  }

  /** Marca último acceso ahora (útil tras un login, etc.). */
  touchLastAccess(id: string) {
    return this.update(id, { lastAccess: new Date().toISOString() });
  }

  /**
   * Credenciales para login: incluye `passwordHash` (bcrypt).
   */
  async findByUsername(username: string) {
    const normalized = username.trim().toLowerCase();
    const user = await this.users
      .findOne({ username: normalized })
      .select('+passwordHash')
      .lean()
      .exec();
    if (!user) {
      return null;
    }
    return {
      id: String(user._id),
      username: user.username,
      passwordHash: user.passwordHash,
      role: (user.role as UserRole | undefined) ?? UserRole.User,
    };
  }

  /** Usuario público (sin hash) o 404. */
  private async findPublicById(id: string) {
    const user = await this.users.findById(id).lean().exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  private throwIfDuplicateUsername(error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error
      ? (error as { code: number }).code
      : undefined;
    if (code === 11000) {
      throw new ConflictException('Ese nombre de usuario ya existe');
    }
  }
}
