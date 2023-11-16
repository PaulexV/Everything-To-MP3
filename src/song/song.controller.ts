import { AuthService } from "./../auth/auth.service"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import {
    Controller,
    Get,
    Headers,
    Query,
    Req,
    Res,
    StreamableFile,
} from "@nestjs/common"
import { SongService } from "./song.service"
import { Response } from "express"
import { shortenUrl } from "../helper/helper"
import { RateLimit } from "nestjs-rate-limiter"

@ApiTags("Song")
@ApiBearerAuth()
@Controller("song")
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly AuthService: AuthService,
    ) {}
    @RateLimit({
        keyPrefix: "download",
        points: 5,
        duration: 15,
    })
    @Get("download")
    async downloadSong(
        @Headers("x-api-key") apiKey: string,
        @Query("url") url: string,
        @Query("title") title: string | undefined,
        @Req() req: any,
        @Res() res: Response,
    ) {
        const authorization = await this.AuthService.verifyApiKey(
            req.user.id,
            apiKey,
        )
        if (!authorization) {
            res.status(401).send("Unauthorized")
            return
        }
        const shorten = shortenUrl(url)

        const fromDB = await this.songService.getSongFromURL(shorten)
        if (fromDB) {
            // const file = createReadStream(fromDB.filename);
            // res.send(new StreamableFile(file))

            res.send(await this.songService.addPopularity(fromDB))
        } else {
            await this.songService.downloadSong(shorten, title, res)
        }
    }
}
