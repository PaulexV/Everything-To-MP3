import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Song, SongSchema } from "./song.schema"
import { SongController } from "./song.controller"
import { SongService } from "./song.service"
import { AuthModule } from "../auth/auth.module"
import { UserService } from "../user/user.service"
import { UserSchema } from "src/user/user.schema"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
        MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
        AuthModule, 
    ],
    controllers: [SongController],
    providers: [SongService, UserService],
})
export class SongModule {}
