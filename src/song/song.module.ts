import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Song, SongSchema } from "./song.schema"
import { SongController } from "./song.controller"
import { SongService } from "./song.service"
import { AuthModule } from "src/auth/auth.module"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
        AuthModule,
    ],
    controllers: [SongController],
    providers: [SongService],
})
export class SongModule {}
