import type { CreatedTicket } from '@/types/create-ticket.types';

export type TicketsListProps = {
	tickets: CreatedTicket[];
	selectedTicketId?: string;
	onSelectTicket: (id: string) => void;
};
