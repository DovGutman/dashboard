import { create } from 'zustand';
import type {
  CreateTicketFormState,
  CreatedTicket,
  TicketPriority,
  TicketStatus,
} from '@/types/create-ticket.types';
import { ticketsApi } from '@/services/api/tickets/tickets.api';

type TicketsState = {
  tickets: CreatedTicket[];
  fetchTickets: (filters?: {
    status?: TicketStatus;
    priority?: TicketPriority;
  }) => Promise<void>;
  createTicket: (form: CreateTicketFormState) => Promise<CreatedTicket>;
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  assignTicket: (id: string, assignedAgentId: string | null) => Promise<void>;
  getTicketById: (id: string) => CreatedTicket | undefined;
  clearTickets: () => void;
};

export const useTicketsStore = create<TicketsState>()((set, get) => ({
  tickets: [],
  fetchTickets: async (filters) => {
    try {
      const tickets = await ticketsApi.list(filters);
      set({ tickets });
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      set({ tickets: [] });
    }
  },
  createTicket: async (form) => {
    try {
      const ticket = await ticketsApi.create(form);
      set((state) => ({ tickets: [ticket, ...state.tickets] }));
      return ticket;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  },
  updateTicketStatus: async (id, status) => {
    try {
      const updated = await ticketsApi.updateStatus(id, status);
      set((state) => ({
        tickets: state.tickets.map((t) => (t.id === id ? updated : t)),
      }));
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  },
  assignTicket: async (id, assignedAgentId) => {
    try {
      const updated = await ticketsApi.assign(id, assignedAgentId);
      set((state) => ({
        tickets: state.tickets.map((t) => (t.id === id ? updated : t)),
      }));
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  },
  getTicketById: (id) => get().tickets.find((t) => t.id === id),
  clearTickets: () => set({ tickets: [] }),
}));
