import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = this.jwtService.verify(token);
            request.user = payload; // Ajouter le payload du JWT à la requête
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
