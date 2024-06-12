import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UserController} from './interfaces/controllers/user.controller';
import {EventController} from './interfaces/controllers/event.controller';
import {AuthController} from './interfaces/controllers/auth.controller';
import {UserService} from './application/services/user.service';
import {EventService} from './application/services/event.service';
import {AuthService} from './application/services/auth.service';
import {UserRepository} from './domain/repositories/user.repository';
import {EventRepository} from './domain/repositories/event.repository';
import {DatabaseModule} from './infrastructure/database/mongoose.module';
import {LocalStrategy} from './infrastructure/auth/local.strategy';
import {JwtStrategy} from './infrastructure/auth/jwt.strategy';
import {JwtAuthGuard} from "./interfaces/guards/jwt-auth.guard";

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '60m'},
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UserController, EventController, AuthController],
    providers: [
        UserService,
        EventService,
        AuthService,
        UserRepository,
        EventRepository,
        LocalStrategy,
        JwtStrategy,
        JwtAuthGuard,
    ],
})
export class AppModule {
}
