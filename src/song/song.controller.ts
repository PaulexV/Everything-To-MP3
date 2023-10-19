import { Controller, Get } from "@nestjs/common";
import { SongsService } from "./songs.service";

@Controller('songs')
export class SongsController {
    constructor(private readonly songService: SongsService) {}

    @Get()
    findAll() {
        return this.songService.findAll();
    }
}