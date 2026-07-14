import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../common/enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true, maxlength: 120 })
  name: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.Reader,
  })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastAccess: Date | null;

  @Prop({ default: 0 })
  tokenVersion!: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
