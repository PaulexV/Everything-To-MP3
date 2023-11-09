import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Song, SongDocument } from "src/song/song.schema"

@Injectable()
export class SearchService {
    constructor(
        @InjectModel(Song.name)
        private songModel: Model<SongDocument>,
    ) {}

    async exec(searchValue: string): Promise<Song[]> {
        return (await this.songModel.find().exec()).filter(s =>
            s.title.toLowerCase().includes(searchValue.toLowerCase()),
        )
    }
}
