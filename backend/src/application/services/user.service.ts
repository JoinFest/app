import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {User} from '../../domain/models/user.model';
import {UserRepository} from '../../domain/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User(
            Date.now(), // ID generation logic could be different
            createUserDto.email,
            createUserDto.password,
            createUserDto.name,
        );
        return await this.userRepository.create(user);
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByName(name: string): Promise<User> {
        const user = await this.userRepository.findByName(name);
        if (!user) {
            throw new NotFoundException(`User with name ${name} not found`);
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

}
