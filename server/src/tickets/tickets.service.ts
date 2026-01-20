import { Injectable } from '@nestjs/common';
import { Tickets } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  AssignTicketRequest,
  CreateTicketRequest,
  TicketDto,
  TicketQuery,
  TicketPriority,
  TicketStatus,
  UpdateTicketStatusRequest,
} from './tickets.types';
import { prisma } from '../common/db/prisma.client';

@Injectable()
export class TicketsService {
  async create(request: CreateTicketRequest): Promise<TicketDto> {
    const entity = await prisma.tickets.create({
      data: {
        Id: randomUUID(),
        Title: request.title.trim(),
        Description: request.description.trim(),
        Priority: request.priority,
        Status: TicketStatus.Open,
        AssignedAgentId: request.assignedAgentId?.trim() || null,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    });

    return this.toDto(entity);
  }

  async getAll(query: TicketQuery): Promise<TicketDto[]> {
    const items = await prisma.tickets.findMany({
      where: {
        Status: query.status,
        Priority: query.priority,
      },
      orderBy: [{ UpdatedAt: 'desc' }, { CreatedAt: 'desc' }],
    });

    return items.map((ticket) => this.toDto(ticket));
  }

  async getById(id: string): Promise<TicketDto | null> {
    const entity = await prisma.tickets.findUnique({
      where: { Id: id },
    });
    return entity ? this.toDto(entity) : null;
  }

  async updateStatus(
    id: string,
    request: UpdateTicketStatusRequest,
  ): Promise<TicketDto | null> {
    const entity = await prisma.tickets.findUnique({
      where: { Id: id },
    });
    if (!entity) {
      return null;
    }

    const updated = await prisma.tickets.update({
      where: { Id: id },
      data: {
        Status: request.status,
        UpdatedAt: new Date(),
      },
    });

    return this.toDto(updated);
  }

  async assign(id: string, request: AssignTicketRequest): Promise<TicketDto | null> {
    const entity = await prisma.tickets.findUnique({
      where: { Id: id },
    });
    if (!entity) {
      return null;
    }

    const updated = await prisma.tickets.update({
      where: { Id: id },
      data: {
        AssignedAgentId: request.assignedAgentId.trim(),
        UpdatedAt: new Date(),
      },
    });

    return this.toDto(updated);
  }

  private toDto(entity: Tickets): TicketDto {
    return {
      id: entity.Id,
      title: entity.Title,
      description: entity.Description,
      priority: entity.Priority,
      status: entity.Status,
      assignedAgentId: entity.AssignedAgentId,
      createdAt: entity.CreatedAt,
      updatedAt: entity.UpdatedAt,
    };
  }
}
