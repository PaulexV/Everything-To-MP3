import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./user/users.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { SongController } from "./song/song.controller";
import { PlaylistController } from "./playlist/playlist.controller";
import { SongService } from "./song/song.service";
import { PlaylistService } from "./playlist/playlist.service";

@Module({
	imports: [],
	controllers: [AuthController, SongController, PlaylistController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		AuthService,
		JwtService,
		UsersService,
		SongService,
		PlaylistService
	],
})
export class AppModule {}