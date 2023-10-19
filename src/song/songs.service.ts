import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Song, SongDocument } from 'src/song/songs.schema';

@Injectable()
export class SongsService {
    constructor(
        @InjectModel(Song.name)
        private songModel: Model<SongDocument>,
    ) {}

    async findAll(): Promise<Song[]> {
    return this.songModel.find().exec();
    }
}