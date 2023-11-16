import { AuthService } from "./../auth/auth.service"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { Controller, Get, Query, Res, Headers, Req } from "@nestjs/common"
import { Response } from "express"
import { PlaylistService } from "./playlist.service"
import { RateLimit } from "nestjs-rate-limiter"

@ApiTags("Playlist")
@ApiBearerAuth()
@Controller("playlist")
export class PlaylistController {
    constructor(
        private readonly playlistService: PlaylistService,
        private readonly AuthService: AuthService,
    ) {}
    
    @RateLimit({
        keyPrefix: 'download',
        points: 5,
        duration: 15,
      })
    @Get("download")
    async downloadSong(
        @Headers("x-api-key") apiKey: string,
        @Query("url") playlistUrl: string,
        @Res() res: Response,
        @Req() req: any,
    ) {
        const authorization = await this.AuthService.verifyApiKey(
            req.user.id,
            apiKey,
        )
        if (!authorization) {
            res.status(401).send("Unauthorized")
            return
        }
        await this.playlistService.downloadPlaylist(playlistUrl, res)
    }
}
