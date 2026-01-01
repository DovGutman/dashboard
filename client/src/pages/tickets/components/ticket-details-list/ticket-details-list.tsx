import type { TicketDetailsListProps } from './ticket-details-list.types';

export function TicketDetailsList({ ticket }: TicketDetailsListProps) {
	return (
		<ul>
			<li>
				<strong>ID:</strong> {ticket.id}
			</li>
			<li>
				<strong>Title:</strong> {ticket.title}
			</li>
			<li>
				<strong>Description:</strong> {ticket.description}
			</li>
			<li>
				<strong>Status:</strong> {ticket.status}
			</li>
			<li>
				<strong>Priority:</strong> {ticket.priority}
			</li>
			<li>
				<strong>Assigned Agent:</strong> {ticket.assignedAgent || 'Unassigned'}
			</li>
			<li>
				<strong>Created:</strong> {ticket.createdAtIso}
			</li>
			<li>
				<strong>Updated:</strong> {ticket.updatedAtIso}
			</li>
		</ul>
	);
}
