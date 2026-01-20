import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  TicketDto,
  TicketPriority,
  TicketStatus,
} from './tickets.types';

const enumValues = <T extends Record<string, number | string>>(enumObj: T) =>
  Object.values(enumObj).filter((value) => typeof value === 'number');

const ticketExample: TicketDto = {
  id: '0b6e0c8a-6c13-4e1f-84f2-3a6d20a283e1',
  title: 'Printer is offline',
  description: 'The 3rd floor printer is not responding.',
  priority: TicketPriority.Medium,
  status: TicketStatus.Open,
  assignedAgentId: null,
  createdAt: new Date('2026-01-19T08:30:00.000Z'),
  updatedAt: new Date('2026-01-19T08:30:00.000Z'),
};

const applyMethodDecorators = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor | undefined,
  decorators: MethodDecorator[],
) => {
  const resolvedDescriptor =
    descriptor ?? Object.getOwnPropertyDescriptor(target, propertyKey);
  if (!resolvedDescriptor) {
    return;
  }

  for (const decorator of decorators) {
    decorator(target, propertyKey, resolvedDescriptor);
  }
};

export const ApiCreateTicket = () => (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  applyMethodDecorators(target, propertyKey, descriptor, [
    ApiOperation({ summary: 'Create a ticket' }),
    ApiBody({
      description: 'Ticket details to create.',
      schema: {
        type: 'object',
        required: ['title', 'description', 'priority'],
        properties: {
          title: { type: 'string', example: 'Printer is offline' },
          description: {
            type: 'string',
            example: 'The 3rd floor printer is not responding.',
          },
          priority: {
            type: 'integer',
            enum: enumValues(TicketPriority),
            example: TicketPriority.Medium,
          },
          assignedAgentId: {
            type: 'string',
            nullable: true,
            example: '2c1f5d91-7a0f-4e8c-a835-9bb6a1dcd2cb',
          },
        },
      },
      examples: {
        basic: {
          summary: 'Create an unassigned ticket',
          value: {
            title: 'Printer is offline',
            description: 'The 3rd floor printer is not responding.',
            priority: TicketPriority.Medium,
          },
        },
        assigned: {
          summary: 'Create a ticket assigned to an agent',
          value: {
            title: 'Email login fails',
            description: 'User cannot sign in to the email portal.',
            priority: TicketPriority.High,
            assignedAgentId: '2c1f5d91-7a0f-4e8c-a835-9bb6a1dcd2cb',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Ticket created.',
      schema: { example: ticketExample },
    }),
  ]);
};

export const ApiGetTickets = () => (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  applyMethodDecorators(target, propertyKey, descriptor, [
    ApiOperation({ summary: 'List tickets' }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filter by status.',
      schema: {
        type: 'integer',
        enum: enumValues(TicketStatus),
      },
      example: TicketStatus.InProgress,
    }),
    ApiQuery({
      name: 'priority',
      required: false,
      description: 'Filter by priority.',
      schema: {
        type: 'integer',
        enum: enumValues(TicketPriority),
      },
      example: TicketPriority.High,
    }),
    ApiResponse({
      status: 200,
      description: 'List of tickets.',
      schema: { example: [ticketExample] },
    }),
  ]);
};

export const ApiGetTicketById = () => (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  applyMethodDecorators(target, propertyKey, descriptor, [
    ApiOperation({ summary: 'Get a ticket by id' }),
    ApiParam({
      name: 'id',
      description: 'Ticket id (UUID).',
      example: '0b6e0c8a-6c13-4e1f-84f2-3a6d20a283e1',
    }),
    ApiResponse({
      status: 200,
      description: 'Ticket found.',
      schema: { example: ticketExample },
    }),
  ]);
};

export const ApiUpdateTicketStatus = () => (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  applyMethodDecorators(target, propertyKey, descriptor, [
    ApiOperation({ summary: 'Update ticket status' }),
    ApiParam({
      name: 'id',
      description: 'Ticket id (UUID).',
      example: '0b6e0c8a-6c13-4e1f-84f2-3a6d20a283e1',
    }),
    ApiBody({
      description: 'New status for the ticket.',
      schema: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'integer',
            enum: enumValues(TicketStatus),
            example: TicketStatus.Resolved,
          },
        },
      },
      examples: {
        resolve: {
          summary: 'Resolve a ticket',
          value: { status: TicketStatus.Resolved },
        },
        progress: {
          summary: 'Mark as in progress',
          value: { status: TicketStatus.InProgress },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Ticket updated.',
      schema: {
        example: { ...ticketExample, status: TicketStatus.Resolved },
      },
    }),
  ]);
};

export const ApiAssignTicket = () => (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  applyMethodDecorators(target, propertyKey, descriptor, [
    ApiOperation({ summary: 'Assign a ticket to an agent' }),
    ApiParam({
      name: 'id',
      description: 'Ticket id (UUID).',
      example: '0b6e0c8a-6c13-4e1f-84f2-3a6d20a283e1',
    }),
    ApiBody({
      description: 'Agent to assign.',
      schema: {
        type: 'object',
        required: ['assignedAgentId'],
        properties: {
          assignedAgentId: {
            type: 'string',
            example: '2c1f5d91-7a0f-4e8c-a835-9bb6a1dcd2cb',
          },
        },
      },
      examples: {
        assign: {
          summary: 'Assign to an agent',
          value: { assignedAgentId: '2c1f5d91-7a0f-4e8c-a835-9bb6a1dcd2cb' },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Ticket assigned.',
      schema: {
        example: {
          ...ticketExample,
          assignedAgentId: '2c1f5d91-7a0f-4e8c-a835-9bb6a1dcd2cb',
        },
      },
    }),
  ]);
};
