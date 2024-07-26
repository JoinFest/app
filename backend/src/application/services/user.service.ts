import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {User} from '../../domain/models/user.model';
import {UserRepository} from '../../domain/repositories/user.repository';
import {ObjectId} from 'bson';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = new User(
            new ObjectId(),
            createUserDto.email,
            hashedPassword, // Use the hashed password
            createUserDto.name,
        );
        return await this.userRepository.create(user);
    }

    async findById(id: ObjectId): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    async delete(id: ObjectId): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepository.delete(id);
    }
}
