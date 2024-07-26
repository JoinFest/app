import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UserService} from '../../application/services/user.service';
import {CreateUserDto} from '../../application/dto/create-user.dto';
import {User} from '../../domain/models/user.model';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {ObjectId} from 'bson';

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
    @ApiResponse({status: 409, description: 'Conflict'})
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.userService.create(createUserDto);
    }

    @Get(':id')
    @ApiOperation({summary: 'Get user by ID'})
    @ApiParam({name: 'id', type: String})
    @ApiResponse({status: 200, description: 'User found'})
    @ApiResponse({status: 404, description: 'User not found'})
    async findById(@Param('id') id: string): Promise<User> {
        return await this.userService.findById(new ObjectId(id));
    }

    @Get()
    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, description: 'Users found'})
    async findAll(): Promise<Partial<User>[]> {
        const users = await this.userService.findAll();
        return users.map(user => {
            const {password, ...result} = user; // Exclude password
            return result;
        });
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete user by ID'})
    @ApiParam({name: 'id', type: String})
    @ApiResponse({status: 200, description: 'User deleted successfully'})
    @ApiResponse({status: 404, description: 'User not found'})
    async delete(@Param('id') id: string): Promise<void> {
        return await this.userService.delete(new ObjectId(id));
    }
}
