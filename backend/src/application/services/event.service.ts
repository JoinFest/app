import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateEventDto} from '../dto/create-event.dto';
import {Event} from '../../domain/models/event.model';
import {EventRepository} from '../../domain/repositories/event.repository';

@Injectable()
export class EventService {
    constructor(private readonly eventRepository: EventRepository) {
    }

    async create(createEventDto: CreateEventDto): Promise<Event> {
        const event = new Event(
            Date.now(), // ID generation logic could be different
            createEventDto.name,
            createEventDto.description,
            createEventDto.date,
        );
        return await this.eventRepository.create(event);
    }

    async findById(id: number): Promise<Event> {
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
