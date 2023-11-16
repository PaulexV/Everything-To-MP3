import { Module } from "@nestjs/common"
import { PlaylistController } from "./playlist.controller"
import { PlaylistService } from "./playlist.service"
import { AuthModule } from "../auth/auth.module"

@Module({
    imports: [AuthModule],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
