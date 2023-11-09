import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Song, SongSchema } from "./song.schema"
import { SongController } from "./song.controller"
import { SongService } from "./song.service"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  controllers: [SongController],
  providers: [SongService],
})
export class SongModule {}
