import type { CreateTicketFormErrors, CreateTicketFormState } from '@/types/create-ticket.types';

export type TicketFieldsProps = {
	value: CreateTicketFormState;
	errors?: CreateTicketFormErrors;
	onChange: <K extends keyof CreateTicketFormState>(key: K, value: CreateTicketFormState[K]) => void;
};
