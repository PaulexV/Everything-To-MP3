import { ApiBody, ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    UseGuards,
    Request,
} from "@nestjs/common"
import { AuthService, Public } from "./auth.service"
import { SignInDto } from "./auth.dto"
import { AdminGuard } from "./admin.guard"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("getAccessToken")
    @ApiBody({
        type: SignInDto,
        required: true,
    })
    signIn(@Body() signInDto: Record<string, string>) {
        return this.authService.getAccessToken(
            signInDto.username,
            signInDto.password,
        )
    }

    @Get("profile")
    getProfile(@Request() req: any) {
        return req.user
    }
}
