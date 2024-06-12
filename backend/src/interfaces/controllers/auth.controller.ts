import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from '../../application/services/auth.service';
import {LocalAuthGuard} from '../guards/local-auth.guard';
import {CreateUserDto} from '../../application/dto/create-user.dto';
import {LoginDto} from '../../application/dto/login.dto';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({summary: 'User login'})
    @ApiBody({type: LoginDto})
    @ApiResponse({status: 201, description: 'Successful login'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @ApiOperation({summary: 'User registration'})
    @ApiBody({type: CreateUserDto})
    @ApiResponse({status: 201, description: 'User registered successfully'})
    @ApiResponse({status: 400, description: 'Bad Request'})
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }
}
