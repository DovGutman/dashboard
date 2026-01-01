import './ticket-detail.css';
import { SelectField } from '@/components/select-field';
import type { TicketStatus } from '@/types/create-ticket.types';
import type { TicketDetailProps } from '@/pages/tickets/types/ticket-detail.types';
import { TicketDetailsList } from '@/pages/tickets/components/ticket-details-list';

export function TicketDetail({ ticket, statuses, onUpdateStatus }: TicketDetailProps) {
	if (!ticket) return <p>Select a ticket from the list.</p>;

	return (
		<>
			<section className="tickets__actions" aria-label="Ticket actions">
				<SelectField<TicketStatus>
					id="status"
					name="status"
					label="Status"
					value={ticket.status}
					onChange={(value) => void onUpdateStatus(ticket.id, value)}
					options={statuses.map((s) => ({ value: s, label: s }))}
				/>
			</section>

			<TicketDetailsList ticket={ticket} />
		</>
	);
}
