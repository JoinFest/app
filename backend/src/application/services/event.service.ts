import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateEventDto} from '../dto/create-event.dto';
import {Event} from '../../domain/models/event.model';
import {EventRepository} from '../../domain/repositories/event.repository';
import {ObjectId} from 'bson';

@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) {
    }

    async create(createEventDto: CreateEventDto & { hostId: string }): Promise<Event> {
        const event = new Event(
            new ObjectId(),
            createEventDto.name,
            createEventDto.description,
            new Date(createEventDto.date),
            createEventDto.location,
            new ObjectId(createEventDto.hostId) // Utilisation de l'ID de l'hôte
        );
        console.log(createEventDto);
        return await this.eventRepository.create(event);
    }

    async findByHost(hostId: ObjectId): Promise<Event[]> {
        return await this.eventRepository.findByHost(hostId);
    }

    async findById(id: ObjectId): Promise<Event> {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async findAll(): Promise<Event[]> {
        return await this.eventRepository.findAll();
    }
}
