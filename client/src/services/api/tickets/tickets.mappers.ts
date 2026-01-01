import type {
	CreateTicketFormState,
	CreatedTicket,
	TicketPriority,
	TicketStatus,
} from '@/types/create-ticket.types';
import type {
	CreateTicketRequestDto,
	TicketDto,
	TicketPriorityDto,
	TicketStatusDto,
} from './tickets.dto';

const PRIORITY_TO_DTO: Record<TicketPriority, TicketPriorityDto> = {
	Low: 0,
	Medium: 1,
	High: 2,
	Critical: 3,
};

const PRIORITY_FROM_DTO: Record<TicketPriorityDto, TicketPriority> = {
	0: 'Low',
	1: 'Medium',
	2: 'High',
	3: 'Critical',
};

const STATUS_TO_DTO: Record<TicketStatus, TicketStatusDto> = {
	Open: 0,
	'In Progress': 1,
	Resolved: 2,
};

const STATUS_FROM_DTO: Record<TicketStatusDto, TicketStatus> = {
	0: 'Open',
	1: 'In Progress',
	2: 'Resolved',
};

export function ticketFromDto(dto: TicketDto): CreatedTicket {
	return {
		id: dto.id,
		title: dto.title ?? '',
		description: dto.description ?? '',
		priority: PRIORITY_FROM_DTO[dto.priority],
		status: STATUS_FROM_DTO[dto.status],
		assignedAgent: dto.assignedAgentId ?? '',
		createdAtIso: dto.createdAt,
		updatedAtIso: dto.updatedAt,
	};
}

export function createTicketRequestFromForm(form: CreateTicketFormState): CreateTicketRequestDto {
	return {
		title: form.title.trim() || null,
		description: form.description.trim() || null,
		priority: PRIORITY_TO_DTO[form.priority],
		assignedAgentId: form.assignedAgent.trim() || null,
	};
}

export function statusToDto(status: TicketStatus): TicketStatusDto {
	return STATUS_TO_DTO[status];
}

export function priorityToDto(priority: TicketPriority): TicketPriorityDto {
	return PRIORITY_TO_DTO[priority];
}
