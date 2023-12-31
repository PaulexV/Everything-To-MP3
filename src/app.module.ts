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
import { CacheModule } from "@nestjs/cache-manager"
import { PaymentModule } from "./payment/payment.module"

import * as dotenv from "dotenv"
import { RateLimiterGuard, RateLimiterModule } from "nestjs-rate-limiter"

dotenv.config()
@Module({
    imports: [
        CacheModule.register({ isGlobal: true }),

        // Conditionnellement importer le module en fonction de l'environnement Docker
        ...(process.env.DOCKER_CONTAINER === "true"
            ? [MongooseModule.forRoot(process.env.MONGODB_URL_DOCKER)]
            : [MongooseModule.forRoot(process.env.MONGODB_URL_LOCAL)]),
        SongModule,
        AuthModule,
        PlaylistModule,
        SearchModule,
        UserModule,
        RateLimiterModule.register({
            keyPrefix: "global",
            points: 30,
            duration: 60,
        }),
        PaymentModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RateLimiterGuard,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        JwtService,
    ],
})
export class AppModule {}
