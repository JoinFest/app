import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Event} from '../models/event.model';
import {Injectable} from '@nestjs/common';

@Injectable()
export class EventRepository {
    constructor(@InjectModel('Event') private readonly eventModel: Model<Event>) {
    }

    async create(event: Event): Promise<Event> {
        const createdEvent = new this.eventModel(event);
        return await createdEvent.save();
    }

    async findById(id: number): Promise<Event> {
        return await this.eventModel.findById(id).exec();
    }

    async findAll(): Promise<Event[]> {
        return await this.eventModel.find().exec();
    }
}
