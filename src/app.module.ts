import { MongooseModule } from "@nestjs/mongoose"
import { JwtService } from "@nestjs/jwt"
import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./auth/auth.guard"
import { SongModule } from "./song/song.module"
import { AuthModule } from "./auth/auth.module"
import { PlaylistModule } from "./playlist/playlist.module"
import { SearchModule } from "./search/search.module"
import { UserModule } from "./user/user.module"
import { UserService } from "./user/user.service"

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://127.0.0.1/e2mp3"),
        SongModule,
        AuthModule,
        PlaylistModule,
        SearchModule,
        UserModule,        
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        JwtService,
    ],
})
export class AppModule {}
