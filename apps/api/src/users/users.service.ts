import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '../common/enums';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { hashUserPassword } from './users.crypto';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastAccess: unknown;
  createdAt: unknown;
  updatedAt: unknown;
}

function toPublicUser(doc: unknown): PublicUser {
  const d = doc as Record<string, unknown>;

  return {
    id: String(d._id),
    email: d.email as string,
    name: d.name as string,
    role: d.role as UserRole,
    isActive: Boolean(d.isActive),
    lastAccess: d.lastAccess,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdminFromEnv();
  }

  private async seedAdminFromEnv() {
    const email = this.config
      .get<string>('SEED_ADMIN_EMAIL')
      ?.trim()
      .toLowerCase();

    const password = this.config.get<string>('SEED_ADMIN_PASSWORD');

    if (!email || !password) {
      return;
    }

    const exists = await this.users.exists({ email }).exec();

    if (exists) {
      return;
    }

    const passwordHash = await hashUserPassword(password);

    await this.users.create({
      email,
      name: this.config.get<string>('SEED_ADMIN_NAME', 'Administrador'),
      passwordHash,
      role: UserRole.Admin,
      isActive: true,
      lastAccess: null,
    });

    this.logger.log(`Usuario admin sembrado: ${email}`);
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const passwordHash = await hashUserPassword(dto.password);

    try {
      const doc = await this.users.create({
        email: dto.email.trim().toLowerCase(),
        name: dto.name.trim(),
        passwordHash,
        role: dto.role ?? UserRole.Reader,
        isActive: dto.isActive ?? true,
        lastAccess: null,
      });

      return toPublicUser(doc.toObject());
    } catch (e) {
      this.throwIfDuplicate(e);
      throw e;
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PublicUser>> {
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
      data: rows.map((u) => toPublicUser(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.users.findById(id).lean().exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return toPublicUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicUser> {
    const data: Record<string, unknown> = {};

    if (dto.email !== undefined) {
      data.email = dto.email.trim().toLowerCase();
    }

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.password !== undefined) {
      data.passwordHash = await hashUserPassword(dto.password);
    }

    if (dto.role !== undefined) {
      data.role = dto.role;
    }

    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      return this.findOne(id);
    }

    try {
      const updated = await this.users
        .findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        })
        .lean()
        .exec();

      if (!updated) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return toPublicUser(updated);
    } catch (e) {
      this.throwIfDuplicate(e);
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

  async touchLastAccess(id: string) {
    await this.users.findByIdAndUpdate(id, {
      lastAccess: new Date(),
    });
  }

  async findByEmailForAuth(email: string) {
    const normalized = email.trim().toLowerCase();

    const user = await this.users
      .findOne({ email: normalized })
      .select('+passwordHash')
      .lean()
      .exec();

    if (!user) {
      return null;
    }

    const u = user as Record<string, unknown>;

    return {
      id: String(u._id),
      email: u.email as string,
      name: u.name as string,
      passwordHash: u.passwordHash as string,
      role: (u.role as UserRole) ?? UserRole.Reader,
      isActive: Boolean(u.isActive ?? true),
    };
  }

  private throwIfDuplicate(error: unknown) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? (error as { code: number }).code
        : undefined;

    if (code === 11000) {
      throw new ConflictException('Ese email ya está registrado');
    }
  }
}