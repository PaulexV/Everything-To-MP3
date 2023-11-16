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

import * as dotenv from "dotenv"

dotenv.config()
@Module({
    imports: [
        // Conditionnellement importer le module en fonction de l'environnement Docker
        ...(process.env.DOCKER_CONTAINER === "true"
            ? [MongooseModule.forRoot(process.env.MONGODB_URL_DOCKER)]
            : [MongooseModule.forRoot(process.env.MONGODB_URL_LOCAL)]),
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
