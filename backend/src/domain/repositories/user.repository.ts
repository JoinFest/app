import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from '../models/user.model';
import {Injectable} from '@nestjs/common';
import {ObjectId} from "typeorm";

@Injectable()
export class UserRepository {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
    }

    async create(user: User): Promise<User> {
        const createdUser = new this.userModel(user);
        return await createdUser.save();
    }

    async findById(id: ObjectId): Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async findByName(name: string): Promise<User> {
        return await this.userModel.findOne({name}).exec();
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({email}).exec();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }
}
