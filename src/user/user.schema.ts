import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @ApiProperty()
    @Prop({required: true})
    id: string;

    @ApiProperty()
    @Prop({required: true})
    username: string;

    @ApiProperty()
    @Prop({required: true})
    password: string;

    @ApiProperty()
    @Prop({required: true})
    role: "free" | "premium" | "admin";

    @ApiProperty()
    @Prop({required: true})
    limit: number
}

export const UserSchema = SchemaFactory.createForClass(User)