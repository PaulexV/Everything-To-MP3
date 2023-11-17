import { Controller, Get, Query } from "@nestjs/common"
import { SearchService } from "./search.service"
import { Public } from "../auth/auth.service"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { Song } from "../song/song.schema"
@ApiTags("Search")
@Controller("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @ApiResponse({
        status: 200,
        description: "Return the search result",
        type: [Song],
    })
    @Public()
    @Get()
    search(@Query("value") searchValue: string) {
        return this.searchService.exec(searchValue)
    }
}
