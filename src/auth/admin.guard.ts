import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AuthService } from "./auth.service"
import { Reflector } from "@nestjs/core"
import { jwtConstants } from "./auth.constants"
import { Request } from "express"

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            })
            const user = await this.authService.getFromUsername(
                payload.username,
            )
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            return user.role === "admin"
        } catch {
            throw new UnauthorizedException()
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? []
        return type === "Bearer" ? token : undefined
    }
}
