import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type SongDocument = HydratedDocument<Song>;

@Schema()
export class Song {
	@ApiProperty()
	@Prop({ required: true })
	id: string;

	@ApiProperty()
	@Prop({ required: true })
	title: string;

	@ApiProperty()
	@Prop({ required: true })
	filename: string;

	@ApiProperty()
	@Prop({ required: true })
	originalLink: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);
