import { AuthService } from "./../auth/auth.service"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import {
    Controller,
    Get,
    Headers,
    Query,
    Req,
    Res,
} from "@nestjs/common"
import { SongService } from "./song.service"
import { Response } from "express"
import { sanitizeFileName, shortenUrl } from "../helper/helper"
import * as path from "path"


@ApiTags("Song")
@ApiBearerAuth()
@Controller("song")
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly AuthService: AuthService,
    ) {}

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
            const music_title = await this.songService.getMusicTitle(url)
            const blobName = path.basename(sanitizeFileName(music_title, "mp3"));

            await this.songService.addPopularity(fromDB)
            if (await this.songService.blobExists(blobName)) {
                const downloadUrl = this.songService.getDownloadUrl(blobName);
                res.send(downloadUrl);
            } else {
                await this.songService.downloadSong(shorten, title, res)
            }
        } else {
            await this.songService.downloadSong(shorten, title, res)
        }
    }
}
