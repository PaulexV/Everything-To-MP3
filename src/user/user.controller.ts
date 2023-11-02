import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { createUserDto } from "./create-user.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    create(@Body() createUserDto: createUserDto) {
        return this.userService.create(createUserDto.username, createUserDto.password)
    }
}
