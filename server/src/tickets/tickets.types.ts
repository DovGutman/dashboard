export enum TicketPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export enum TicketStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
}

export interface TicketDto {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  assignedAgentId?: string | null;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface AssignTicketRequest {
  assignedAgentId: string;
}

export interface TicketQuery {
  status?: TicketStatus;
  priority?: TicketPriority;
}
