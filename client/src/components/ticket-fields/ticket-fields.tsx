import type { ChangeEvent } from 'react';
import './ticket-fields.css';
import {
	PRIORITIES,
	type TicketPriority,
} from '@/types/create-ticket.types';
import type { TicketFieldsProps } from './ticket-fields.types';

export function TicketFields({ value, errors, onChange }: TicketFieldsProps) {
	function onTextChange(key: 'title' | 'assignedAgent') {
		return (e: ChangeEvent<HTMLInputElement>) => onChange(key, e.target.value);
	}

	function onDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
		onChange('description', e.target.value);
	}

	function onPriorityChange(e: ChangeEvent<HTMLSelectElement>) {
		onChange('priority', e.target.value as TicketPriority);
	}

	return (
		<>
			<div className="field">
				<label htmlFor="title">Title</label>
				<input
					id="title"
					name="title"
					type="text"
					autoComplete="off"
					value={value.title}
					onChange={onTextChange('title')}
					required
					aria-invalid={Boolean(errors?.title) || undefined}
					aria-describedby={errors?.title ? 'title-error' : undefined}
				/>
				{errors?.title ? (
					<p className="field__error" id="title-error" role="alert">
						{errors.title}
					</p>
				) : null}
			</div>

			<div className="field">
				<label htmlFor="description">Description</label>
				<textarea
					id="description"
					name="description"
					rows={6}
					value={value.description}
					onChange={onDescriptionChange}
					required
					aria-invalid={Boolean(errors?.description) || undefined}
					aria-describedby={errors?.description ? 'description-error' : undefined}
				/>
				{errors?.description ? (
					<p className="field__error" id="description-error" role="alert">
						{errors.description}
					</p>
				) : null}
			</div>

			<div className="field">
				<label htmlFor="priority">Priority</label>
				<select
					id="priority"
					name="priority"
					value={value.priority}
					onChange={onPriorityChange}
					required
					aria-invalid={Boolean(errors?.priority) || undefined}
					aria-describedby={errors?.priority ? 'priority-error' : undefined}
				>
					{PRIORITIES.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</select>
				{errors?.priority ? (
					<p className="field__error" id="priority-error" role="alert">
						{errors.priority}
					</p>
				) : null}
			</div>

			<div className="field">
				<label htmlFor="assignedAgent">Assign to agent (optional)</label>
				<input
					id="assignedAgent"
					name="assignedAgent"
					type="text"
					autoComplete="off"
					value={value.assignedAgent}
					onChange={onTextChange('assignedAgent')}
					placeholder="e.g. Alex"
				/>
			</div>
		</>
	);
}
