import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Get, Query, Res, StreamableFile } from "@nestjs/common";
import { SongService } from "./song.service";
import { Response } from "express";
import { shortenUrl } from "src/helper/helper";
import { createReadStream } from "fs";

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
