import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongModule } from './modules/song.module';

@Module({
  imports: [SongModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
