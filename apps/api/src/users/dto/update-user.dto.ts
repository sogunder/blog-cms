import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsDateString()
  lastAccess?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
