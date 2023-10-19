import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./user/users.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { SongController } from "./songs/song.controller";
import { PlaylistController } from "./playlists/playlist.controller";
import { SongService } from "./songs/song.service";
import { PlaylistService } from "./playlists/playlist.service";

@Module({
	imports: [MongooseModule.forRoot("mongodb://127.0.0.1/e2mp3")],
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
		PlaylistService,
	],
})
export class AppModule {}
