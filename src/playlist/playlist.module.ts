import { Module } from "@nestjs/common"
import { PlaylistController } from "./playlist.controller"
import { PlaylistService } from "./playlist.service"
import { AuthModule } from "src/auth/auth.module"

@Module({
    imports: [AuthModule],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
