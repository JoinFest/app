import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {AuthService} from '../../application/services/auth.service';
import {LoginDto} from '../../application/dto/login.dto';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {LocalAuthGuard} from '../guards/local-auth.guard';

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
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
