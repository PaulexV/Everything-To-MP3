import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./auth.constants";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { UserService } from "src/user/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/user.schema";

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: "1h" },
		}),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
	],
	providers: [
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		UserService
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
