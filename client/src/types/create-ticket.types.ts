export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';

export type CreateTicketFormState = {
	title: string;
	description: string;
	priority: TicketPriority;
	assignedAgent: string;
};

export type CreateTicketFormErrors = Partial<Record<keyof CreateTicketFormState, string>>;

export type CreatedTicket = CreateTicketFormState & {
	id: string;
	status: TicketStatus;
	createdAtIso: string;
	updatedAtIso: string;
};

export const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];
