import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() + 10 })
  publishingYear: number;

  @Prop({ required: true })
  poster: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
