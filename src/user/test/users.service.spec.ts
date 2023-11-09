import { UsersService, User } from "../users.service"

describe("UsersService", () => {
    let service: UsersService

    beforeEach(() => {
        service = new UsersService()
    })

    describe("findOne", () => {
        it("should return a user if the username exists", async () => {
            const username = "john"
            const expected: User = {
                userId: 1,
                username: "john",
                password: "changeme",
            }
            const user = await service.findOne(username)
            expect(user).toEqual(expected)
        })

        it("should return undefined if the username does not exist", async () => {
            const username = "doesNotExist"
            const user = await service.findOne(username)
            expect(user).toBeUndefined()
        })
    })
})
