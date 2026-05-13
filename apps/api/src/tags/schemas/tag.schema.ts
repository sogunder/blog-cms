import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, trim: true, maxlength: 80 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, maxlength: 80 })
  slug: string;

  createdAt: Date;
  updatedAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
