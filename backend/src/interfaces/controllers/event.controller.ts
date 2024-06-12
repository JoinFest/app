import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {EventService} from '../../application/services/event.service';
import {CreateEventDto} from '../../application/dto/create-event.dto';
import {Event} from '../../domain/models/event.model';
import {ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {ObjectId} from 'bson';

@ApiTags('events')
@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {
    }

    @Post()
    @ApiOperation({summary: 'Create a new event'})
    @ApiBody({type: CreateEventDto})
    @ApiResponse({status: 201, description: 'Event created successfully'})
    @ApiResponse({status: 400, description: 'Bad Request'})
    async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
        return await this.eventService.create(createEventDto);
    }

    @Get(':id')
    @ApiOperation({summary: 'Get event by ID'})
    @ApiParam({name: 'id', type: String})
    @ApiResponse({status: 200, description: 'Event found'})
    @ApiResponse({status: 404, description: 'Event not found'})
    async findById(@Param('id') id: string): Promise<Event> {
        return await this.eventService.findById(new ObjectId(id));
    }

    @Get()
    @ApiOperation({summary: 'Get all events'})
    @ApiResponse({status: 200, description: 'Events found'})
    async findAll(): Promise<Event[]> {
        return await this.eventService.findAll();
    }
}
