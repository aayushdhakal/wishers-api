import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from '../../../services/event/event.service';
import { CreateEventDto, UpdateEventDto, EventResponseDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards';
import { CurrentUser } from '../../auth/decorators';
import { User } from '@prisma/client';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Create a new event
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createEvent(
    @CurrentUser() user: User,
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventService.createEvent(user.id, createEventDto);
  }

  /**
   * Get all events for the current user
   */
  @Get()
  async getUserEvents(
    @CurrentUser() user: User,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('eventType') eventType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{
    events: EventResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.eventService.getUserEvents(user.id, {
      page,
      limit,
      eventType,
      startDate,
      endDate,
    });
  }

  /**
   * Get upcoming events for the current user
   */
  @Get('upcoming')
  async getUpcomingEvents(
    @CurrentUser() user: User,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<EventResponseDto[]> {
    return this.eventService.getUpcomingEvents(user.id, limit);
  }

  /**
   * Get user event statistics
   */
  @Get('stats')
  async getUserEventStats(
    @CurrentUser() user: User,
  ): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    eventsByType: Record<string, number>;
  }> {
    return this.eventService.getUserEventStats(user.id);
  }

  /**
   * Get events by date range
   */
  @Get('date-range')
  async getEventsByDateRange(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<EventResponseDto[]> {
    return this.eventService.getEventsByDateRange(user.id, startDate, endDate);
  }

  /**
   * Get events by type
   */
  @Get('type/:eventType')
  async getEventsByType(
    @CurrentUser() user: User,
    @Param('eventType') eventType: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<{
    events: EventResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.eventService.getEventsByType(user.id, eventType, { page, limit });
  }

  /**
   * Get a specific event by ID
   */
  @Get(':id')
  async getEventById(
    @CurrentUser() user: User,
    @Param('id') eventId: string,
  ): Promise<EventResponseDto> {
    return this.eventService.getEventById(user.id, eventId);
  }

  /**
   * Update an event
   */
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateEvent(
    @CurrentUser() user: User,
    @Param('id') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventService.updateEvent(user.id, eventId, updateEventDto);
  }

  /**
   * Delete an event
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(
    @CurrentUser() user: User,
    @Param('id') eventId: string,
  ): Promise<void> {
    return this.eventService.deleteEvent(user.id, eventId);
  }
}
