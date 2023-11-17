import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger"
import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    Request,
} from "@nestjs/common"
import { AuthService, Public } from "./auth.service"
import { SignInDto } from "./auth.dto"
import { User } from "../user/user.schema"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("accessToken")
    @ApiBody({
        type: SignInDto,
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: "Return the access token",
        type: String,
    })
    signIn(@Body() signInDto: Record<string, string>) {
        return this.authService.getAccessToken(
            signInDto.username,
            signInDto.password,
        )
    }

    @ApiResponse({
        status: 200,
        description: "Return the user profile",
        type: User,
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized",
    })
    @ApiBearerAuth()
    @Get("profile")
    getProfile(@Request() req: any) {
        return req.user
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Return the api key",
        type: String,
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized",
    })
    @Get("apiKey")
    getApiKey(@Request() req: any) {
        return this.authService.generateApiKey(req.user.id)
    }
}
