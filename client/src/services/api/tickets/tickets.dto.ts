export type TicketPriorityDto = 0 | 1 | 2 | 3;
export type TicketStatusDto = 0 | 1 | 2;

export type CreateTicketRequestDto = {
	title?: string | null;
	description?: string | null;
	priority: TicketPriorityDto;
	assignedAgentId?: string | null;
};

export type UpdateTicketStatusRequestDto = {
	status: TicketStatusDto;
};

export type AssignTicketRequestDto = {
	assignedAgentId?: string | null;
};

export type TicketDto = {
	id: string;
	title?: string | null;
	description?: string | null;
	priority: TicketPriorityDto;
	status: TicketStatusDto;
	assignedAgentId?: string | null;
	createdAt: string;
	updatedAt: string;
};
