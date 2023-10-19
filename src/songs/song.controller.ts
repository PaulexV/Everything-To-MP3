import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SongService } from './song.service';

@Controller()
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get('download_song')
  async downloadSong(@Query('url') musicUrl: string, @Res() res: Response) {
    await this.songService.downloadSong(musicUrl, res);
  }
}
