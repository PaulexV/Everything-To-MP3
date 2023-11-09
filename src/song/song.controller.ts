import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { Controller, Get, Query, Res } from "@nestjs/common"
import { SongService } from "./song.service"
import { Response } from "express"
import { Song } from "./song.schema"

@ApiTags("Song")
@ApiBearerAuth()
@Controller("song")
export class SongController {
    constructor(private readonly songService: SongService) {}

    @Get()
    findAll() {
        return this.songService.findAll()
    }

    @Get("download")
    async downloadSong(
        @Query("url") url: string,
        @Query("title") title: string | undefined,
        @Res() res: Response,
    ) {
        await this.songService.downloadSong(url, title, res)
    }
}
