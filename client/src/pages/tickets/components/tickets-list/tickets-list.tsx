import './tickets-list.css';
import type { TicketsListProps } from './tickets-list.types';

export function TicketsList({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: TicketsListProps) {
  return (
    <>
      {tickets.map((t) => (
        <button
          key={t.id}
          type="button"
          className="ticket-row"
          onClick={() => onSelectTicket(t.id)}
          aria-current={t.id === selectedTicketId ? 'true' : undefined}
        >
          <div>
            <strong>{t.title || '(Untitled)'}</strong>
          </div>
          <div className="ticket-row__meta">
            {t.status} • {t.priority}
            {t.assignedAgent ? ` • ${t.assignedAgent}` : ''}
          </div>
        </button>
      ))}
    </>
  );
}
