import { Body, Controller, Patch, Post } from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger"
import { UserService } from "./user.service"
import { createUserDto } from "./user.dto"
import { BadRequestError } from "../helper/errorManager"
import { Public } from "../auth/auth.service"
import { User } from "./user.schema"

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiCreatedResponse({
        status: 201,
        description: "Return the user profile",
        type: User,
    })
    @Public()
    @Post("create")
    create(@Body() createUserDto: createUserDto) {
        return this.userService.create(
            createUserDto.username,
            createUserDto.password,
        )
    }

    @ApiResponse({
        status: 200,
        description: "Return the user profile with updated role",
        type: User,
    })
    @ApiResponse({
        status: 400,
        description: "Bad request",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized",
    })
    @ApiBearerAuth()
    @Patch("upgrade")
    async upgrade(@Body() userDto: Record<string, string>) {
        const user = await this.userService.getFromId(userDto.id)
        if (user && user.role !== "free")
            throw BadRequestError("Can only upgrade user with free plan")
        return this.userService.edit(userDto.id, { role: "premium" })
    }

    @ApiResponse({
        status: 200,
        description: "Return the user profile with updated role",
        type: User,
    })
    @ApiResponse({
        status: 400,
        description: "Bad request",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized",
    })
    @ApiBearerAuth()
    @Patch("downgrade")
    async downgrade(@Body() userDto: Record<string, string>) {
        const user = await this.userService.getFromId(userDto.id)
        if (user && user.role !== "premium")
            throw BadRequestError("Can only downgrade user with premium plan")
        return this.userService.edit(userDto.id, { role: "free" })
    }
}
