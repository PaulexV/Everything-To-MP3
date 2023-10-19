import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./user/users.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";

@Module({
	imports: [],
	controllers: [AuthController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		AuthService,
		JwtService,
		UsersService,
	],
})
export class AppModule {}
