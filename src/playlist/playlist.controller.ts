import { AuthService } from "./../auth/auth.service"
import { ApiTags, ApiBearerAuth, ApiResponse } from "@nestjs/swagger"
import { Controller, Get, Query, Res, Headers, Req } from "@nestjs/common"
import { Response } from "express"
import { PlaylistService } from "./playlist.service"
import { RateLimit } from "nestjs-rate-limiter"
import { UserService } from "../user/user.service"

@ApiTags("Playlist")
@ApiBearerAuth()
@Controller("playlist")
export class PlaylistController {
    constructor(
        private readonly playlistService: PlaylistService,
        private readonly AuthService: AuthService,
        private readonly userService: UserService,
    ) {}

    @ApiResponse({
        status: 200,
        description:
            "Return a zip folder, containing all the songs of the playlist",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized",
    })
    @RateLimit({
        keyPrefix: "download",
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
        await this.userService.removeCredit(req.user.id)

        await this.playlistService.downloadPlaylist(playlistUrl, res)
    }
}
