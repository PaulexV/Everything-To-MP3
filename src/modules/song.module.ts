import { Module } from '@nestjs/common';
import { SongController } from '../controllers/song.controller';
import { SongService } from '../services/song.service';

@Module({
  imports: [],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {} 