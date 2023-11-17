import { Injectable, Inject } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Song, SongDocument } from "../song/song.schema"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"

@Injectable()
export class SearchService {
    constructor(
        @InjectModel(Song.name)
        private songModel: Model<SongDocument>,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    async exec(searchValue: string): Promise<Song[]> {
        const cachedData = await this.cacheManager.get("cache-cache")
        if (cachedData) {
            return cachedData as Song[]
        }
        const res = (await this.songModel.find().exec()).filter(s =>
            s.title.toLowerCase().includes(searchValue.toLowerCase()),
        )
        await this.cacheManager.set("cache-cache", res, 600)

        return res
    }
}
