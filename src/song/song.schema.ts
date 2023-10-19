import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema()
export class Song {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalLink: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);