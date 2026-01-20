import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import {
  ApiAssignTicket,
  ApiCreateTicket,
  ApiGetTicketById,
  ApiGetTickets,
  ApiUpdateTicketStatus,
} from './tickets.swagger';
import {
  AssignTicketRequest,
  CreateTicketRequest,
  TicketDto,
  TicketPriority,
  TicketQuery,
  TicketStatus,
  UpdateTicketStatusRequest,
} from './tickets.types';
import { isBlank, parseOptionalEnum } from '../common/utils/validation.utils';

@ApiTags('tickets')
@Controller('api/Tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiCreateTicket()
  async create(@Body() request: CreateTicketRequest): Promise<TicketDto> {
    if (isBlank(request.title) || isBlank(request.description)) {
      throw new BadRequestException('Title and Description are required.');
    }

    return await this.ticketsService.create(request);
  }

  @Get()
  @ApiGetTickets()
  async getAll(
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
  ): Promise<TicketDto[]> {
    const query: TicketQuery = {
      status,
      priority,
    };

    

    return await this.ticketsService.getAll(query);
  }

  @Get(':id')
  @ApiGetTicketById()
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<TicketDto> {
    const ticket = await this.ticketsService.getById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found.');
    }

    return ticket;
  }

  @Patch(':id/status')
  @ApiUpdateTicketStatus()
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() request: UpdateTicketStatusRequest,
  ): Promise<TicketDto> {
    const updated = await this.ticketsService.updateStatus(id, request);
    if (!updated) {
      throw new NotFoundException('Ticket not found.');
    }

    return updated;
  }

  @Patch(':id/assign')
  @ApiAssignTicket()
  async assign(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() request: AssignTicketRequest,
  ): Promise<TicketDto> {
    if (isBlank(request.assignedAgentId)) {
      throw new BadRequestException('AssignedAgentId is required.');
    }

    const updated = await this.ticketsService.assign(id, request);
    if (!updated) {
      throw new NotFoundException('Ticket not found.');
    }

    return updated;
  }
}
