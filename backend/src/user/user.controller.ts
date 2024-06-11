import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: any) {
        return this.userService.create(createUserDto);
    }

    @Get(':username')
    async findOne(@Param('username') username: string) {
        return this.userService.findOne(username);
    }
}
