// playlist.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing"
import { PlaylistController } from "../playlist.controller"
import { PlaylistService } from "../playlist.service"
import { PlaylistModule } from "../playlist.module"

describe("PlaylistController", () => {
    let controller: PlaylistController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PlaylistModule],
            controllers: [PlaylistController],
            providers: [PlaylistService],
        }).compile()

        controller = module.get<PlaylistController>(PlaylistController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
