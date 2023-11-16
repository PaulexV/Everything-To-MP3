import { Module } from "@nestjs/common"
import { PlaylistController } from "./playlist.controller"
import { PlaylistService } from "./playlist.service"
import { AuthModule } from "../auth/auth.module"
import { UserService } from "../user/user.service"
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "../user/user.schema"

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService, UserService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
