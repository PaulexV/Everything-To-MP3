import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService, Public } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post("getAccessToken")
	signIn(@Body() signInDto: Record<string, string>) {
		return this.authService.getAccessToken(signInDto.username, signInDto.password);
	}

	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
