import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "../auth.service"
import { UsersService } from "../../user/users.service"
import { JwtService } from "@nestjs/jwt"
import { UnauthorizedException } from "@nestjs/common"

describe("AuthService", () => {
    let service: AuthService
    let mockUsersService: { findOne: jest.Mock }
    let mockJwtService: { signAsync: jest.Mock }

    beforeEach(async () => {
        mockUsersService = {
            findOne: jest.fn(),
        }
        mockJwtService = {
            signAsync: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("getAccessToken", () => {
        it("should throw UnauthorizedException if user not found", async () => {
            mockUsersService.findOne.mockResolvedValueOnce(null)
            await expect(
                service.getAccessToken("username", "password"),
            ).rejects.toThrow(UnauthorizedException)
        })

        it("should throw UnauthorizedException if password does not match", async () => {
            mockUsersService.findOne.mockResolvedValueOnce({
                password: "wrong",
            })
            await expect(
                service.getAccessToken("username", "password"),
            ).rejects.toThrow(UnauthorizedException)
        })

        it("should return a JWT if user is found and password matches", async () => {
            mockUsersService.findOne.mockResolvedValueOnce({
                username: "username",
                password: "password",
            })
            mockJwtService.signAsync.mockResolvedValueOnce("fake-jwt")

            const jwt = await service.getAccessToken("username", "password")

            expect(jwt).toEqual("fake-jwt")
        })
    })
})
