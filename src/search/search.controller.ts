import { Controller, Get, Query } from "@nestjs/common"
import { SearchService } from "./search.service"
import { Public } from "src/auth/auth.service"

@Controller("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @Public()
    search(@Query("value") searchValue: string) {
        return this.searchService.exec(searchValue)
    }
}
