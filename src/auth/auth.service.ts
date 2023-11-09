import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { jwtConstants } from "./auth.constants";
import { SetMetadata } from "@nestjs/common";
import { default as bcrypt } from "bcryptjs";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthService {
	constructor(private usersService: UserService, private jwtService: JwtService) {}

	async getAccessToken(username: string, pass:string) {
		const user = await this.usersService.getFromUsername(username);
		if (!bcrypt.compareSync(pass, user?.password)) {
			throw new UnauthorizedException();
		}
		const payload = { pwd: user.password, username: user.username };
		return this.jwtService.signAsync(payload, {
			secret: jwtConstants.secret,
		});
	}
}
