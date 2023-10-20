import { Controller, Get, Query, Res } from "@nestjs/common";
import { SongService } from "./song.service";
import { Response } from "express";

@Controller('song')
export class SongController {
    constructor(private readonly songService: SongService) {}

    @Get()
    findAll() {
        return this.songService.findAll();
    }

    @Get('download')
    async downloadSong(@Query('url') musicUrl: string, @Res() res: Response) {
        await this.songService.downloadSong(musicUrl, res);
  }
}