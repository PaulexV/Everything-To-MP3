import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { Controller, Get, Query, Res } from "@nestjs/common"
import { Response } from "express"
import { PlaylistService } from "./playlist.service"

@ApiTags("Playlist")
@ApiBearerAuth()
@Controller("playlist")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get("download_playlist")
  async downloadSong(@Query("url") playlistUrl: string, @Res() res: Response) {
    await this.playlistService.downloadPlaylist(playlistUrl, res)
  }
}
