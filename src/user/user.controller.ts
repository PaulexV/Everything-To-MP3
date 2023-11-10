import { Body, Controller, Patch, Post, Put } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { UserService } from "./user.service"
import { createUserDto } from "./user.dto"
import { BadRequestError } from "src/helper/errorManager"

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("create")
    create(@Body() createUserDto: createUserDto) {
        return this.userService.create(
            createUserDto.username,
            createUserDto.password,
        )
    }

    @Patch("upgrade")
    async upgrade(@Body() userDto: Record<string, string>) {
        const user = await this.userService.getFromId(userDto.id)
        if (user && user.role !== "free")
            throw BadRequestError("Can only upgrade user with free plan")
        return this.userService.edit(userDto.id, { role: "premium" })
    }
    @Patch("downgrade")
    async downgrade(@Body() userDto: Record<string, string>) {
        const user = await this.userService.getFromId(userDto.id)
        if (user && user.role !== "premium")
            throw BadRequestError("Can only downgrade user with premium plan")
        return this.userService.edit(userDto.id, { role: "free" })
    }
}
