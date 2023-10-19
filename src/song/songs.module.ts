import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from 'src/song/songs.schema';
import { SongsService } from 'src/song/songs.service';
import { SongsController } from './song.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Song.name, schema: SongSchema }
          ]),
        SongsModule
    ],
    controllers: [SongsController],
    providers: [SongsService],
})
export class SongsModule {}