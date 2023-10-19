import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongModule } from './songs/song.module';
import { PlaylistModule } from './playlists/playlist.module';

@Module({
  imports: [SongModule, PlaylistModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
