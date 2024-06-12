import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {EventService} from '../../application/services/event.service';
import {CreateEventDto} from '../../application/dto/create-event.dto';
import {Event} from '../../domain/models/event.model';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {
    }

    @Post()
    async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
        return await this.eventService.create(createEventDto);
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<Event> {
        return await this.eventService.findById(Number(id));
    }

    @Get()
    async findAll(): Promise<Event[]> {
        return await this.eventService.findAll();
    }
}
