import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UserService} from '../../application/services/user.service';
import {CreateUserDto} from '../../application/dto/create-user.dto';
import {User} from '../../domain/models/user.model';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    @ApiOperation({summary: 'Create a new user'})
    @ApiBody({type: CreateUserDto})
    @ApiResponse({status: 201, description: 'User created successfully'})
    @ApiResponse({status: 400, description: 'Bad Request'})
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.create(createUserDto);
    }

    @Get(':id')
    @ApiOperation({summary: 'Get user by ID'})
    @ApiParam({name: 'id', type: Number})
    @ApiResponse({status: 200, description: 'User found'})
    @ApiResponse({status: 404, description: 'User not found'})
    async findById(@Param('id') id: number): Promise<User> {
        return await this.userService.findById(Number(id));
    }

    @Get('name/:name')
    @ApiOperation({summary: 'Get user by name'})
    @ApiParam({name: 'name', type: String})
    @ApiResponse({status: 200, description: 'User found'})
    @ApiResponse({status: 404, description: 'User not found'})
    async findByName(@Param('name') name: string): Promise<User> {
        return await this.userService.findByName(name);
    }
}
