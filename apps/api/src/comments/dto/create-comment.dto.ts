import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  post: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(8000)
  content: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  guestName?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;
}
