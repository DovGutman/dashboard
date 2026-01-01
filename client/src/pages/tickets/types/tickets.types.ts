import type { TicketPriority, TicketStatus } from '@/types/create-ticket.types';

export type StatusFilter = TicketStatus | 'All';
export type PriorityFilter = TicketPriority | 'All';
