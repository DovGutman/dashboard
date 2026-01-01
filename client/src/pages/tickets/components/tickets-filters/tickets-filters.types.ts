import type { TicketPriority, TicketStatus } from '@/types/create-ticket.types';
import type { PriorityFilter, StatusFilter } from '@/pages/tickets/types/tickets.types';

export type TicketsFiltersProps = {
	statusFilter: StatusFilter;
	priorityFilter: PriorityFilter;
	setStatusFilter: (value: StatusFilter) => void;
	setPriorityFilter: (value: PriorityFilter) => void;
	statuses: TicketStatus[];
	priorities: TicketPriority[];
};
