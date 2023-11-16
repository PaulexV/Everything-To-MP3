import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "../user/user.service"
import { jwtConstants } from "./auth.constants"
import { SetMetadata } from "@nestjs/common"
import { default as bcrypt } from "bcryptjs"
import { User } from "../user/user.schema"
import { v4 as uuidv4 } from "uuid"

export const IS_PUBLIC_KEY = "isPublic"
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async getAccessToken(username: string, pass: string) {
        const user = await this.userService.getFromUsername(username)
        if (!bcrypt.compareSync(pass, user?.password)) {
            throw new UnauthorizedException()
        }
        const payload = { pwd: user.password, username: user.username }
        return this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
        })
    }

    async getFromUsername(username: string): Promise<User> {
        return this.userService.getFromUsername(username)
    }

    async generateApiKey(userId: string): Promise<string> {
        const apiKey = uuidv4()
        const hashedApiKey = await this.hashApiKey(apiKey)
        this.userService.edit(userId, { apiKey: hashedApiKey })
        return apiKey
    }

    async hashApiKey(apiKey: string): Promise<string> {
        const saltRounds = 10
        const hashedApiKey = await bcrypt.hash(apiKey, saltRounds)
        return hashedApiKey
    }

    async verifyApiKey(
        userId: string,
        apiKey: string | undefined,
    ): Promise<boolean> {
        if (!apiKey) throw new UnauthorizedException()
        const user = await this.userService.getFromId(userId)
        if (!user) {
            return false
        }
        const hashedApiKey = user.apiKey
        return await bcrypt.compare(apiKey, hashedApiKey)
    }
}
