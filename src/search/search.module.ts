import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Song, SongSchema } from "src/song/song.schema"
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    ],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
