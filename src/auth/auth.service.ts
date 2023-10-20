import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../user/users.service";
import { jwtConstants } from "./auth.constants";
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

	async getAccessToken(username, pass) {
		const user = await this.usersService.findOne(username);
		if (user?.password !== pass) {
			throw new UnauthorizedException();
		}
		const payload = { pwd: user.password, username: user.username };
		return this.jwtService.signAsync(payload, {
			secret: jwtConstants.secret,
		});
	}
}
