import type { CreatedTicket, TicketStatus } from '@/types/create-ticket.types';

export type TicketDetailProps = {
	ticket?: CreatedTicket;
	statuses: TicketStatus[];
	onUpdateStatus: (id: string, status: TicketStatus) => void | Promise<void>;
};
