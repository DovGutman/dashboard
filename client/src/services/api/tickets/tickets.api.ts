import type {
  CreateTicketFormState,
  CreatedTicket,
  TicketPriority,
  TicketStatus,
} from '@/types/create-ticket.types';
import type {
  AssignTicketRequestDto,
  UpdateTicketStatusRequestDto,
} from '@/services/api/tickets/tickets.dto';
import type { TicketDto } from '@/services/api/tickets/tickets.dto';
import httpService from '@/services/api/http-service';
import {
  createTicketRequestFromForm,
  priorityToDto,
  statusToDto,
  ticketFromDto,
} from '@/services/api/tickets/tickets.mappers';

export const ticketsApi = {
  async list(params?: {
    status?: TicketStatus;
    priority?: TicketPriority;
  }): Promise<CreatedTicket[]> {
    const dtos = await httpService.get<TicketDto[]>('/api/Tickets', {
      status: params?.status ? statusToDto(params.status) : undefined,
      priority: params?.priority ? priorityToDto(params.priority) : undefined,
    });
    return dtos.map(ticketFromDto);
  },

  async getById(id: string): Promise<CreatedTicket> {
    const dto = await httpService.get<TicketDto>(
      `/api/Tickets/${encodeURIComponent(id)}`,
    );
    return ticketFromDto(dto);
  },

  async create(form: CreateTicketFormState): Promise<CreatedTicket> {
    const body = createTicketRequestFromForm(form);
    const dto = await httpService.post<TicketDto>('/api/Tickets', body, {
      headers: { 'Content-Type': 'application/json' },
    });
    return ticketFromDto(dto);
  },

  async updateStatus(id: string, status: TicketStatus): Promise<CreatedTicket> {
    const body: UpdateTicketStatusRequestDto = { status: statusToDto(status) };
    const dto = await httpService.patch<TicketDto>(
      `/api/Tickets/${encodeURIComponent(id)}/status`,
      body,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return ticketFromDto(dto);
  },

  async assign(
    id: string,
    assignedAgentId: string | null,
  ): Promise<CreatedTicket> {
    const body: AssignTicketRequestDto = { assignedAgentId };
    const dto = await httpService.patch<TicketDto>(
      `/api/Tickets/${encodeURIComponent(id)}/assign`,
      body,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return ticketFromDto(dto);
  },
};
