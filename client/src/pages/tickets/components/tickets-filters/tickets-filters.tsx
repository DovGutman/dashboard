import './tickets-filters.css';
import { SelectField } from '@/components/select-field';
import type { TicketsFiltersProps } from './tickets-filters.types';
import type { PriorityFilter, StatusFilter } from '@/pages/tickets/types/tickets.types';

export function TicketsFilters({
	statusFilter,
	priorityFilter,
	setStatusFilter,
	setPriorityFilter,
	statuses,
	priorities,
}: TicketsFiltersProps) {
	return (
		<div className="tickets__filters" aria-label="Ticket filters">
			<div className="tickets__filter">
				<SelectField<StatusFilter>
					id="filter-status"
					name="filter-status"
					label="Status"
					value={statusFilter}
					onChange={setStatusFilter}
					includeAllOption
					options={statuses.map((s) => ({ value: s, label: s }))}
				/>
			</div>

			<div className="tickets__filter">
				<SelectField<PriorityFilter>
					id="filter-priority"
					name="filter-priority"
					label="Priority"
					value={priorityFilter}
					onChange={setPriorityFilter}
					includeAllOption
					options={priorities.map((p) => ({ value: p, label: p }))}
				/>
			</div>
		</div>
	);
}
