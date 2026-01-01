import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './create-ticket.page.css';
import {
	PRIORITIES,
	type CreateTicketFormErrors,
	type CreateTicketFormState,
} from '@/types/create-ticket.types';
import { useTicketsStore } from '@/stores/tickets.store';
import { TicketFields } from '@/components/ticket-fields';

export default function CreateTicketPage() {
	const [form, setForm] = useState<CreateTicketFormState>({
		title: '',
		description: '',
		priority: 'Medium',
		assignedAgent: '',
	});
	const [errors, setErrors] = useState<CreateTicketFormErrors>({});
	const navigate = useNavigate();
	const createTicket = useTicketsStore((s) => s.createTicket);

	const isDirty = useMemo(() => {
		return (
			form.title.trim().length > 0 ||
			form.description.trim().length > 0 ||
			form.priority !== 'Medium' ||
			form.assignedAgent.trim().length > 0
		);
	}, [form]);

	function updateField<K extends keyof CreateTicketFormState>(key: K, value: CreateTicketFormState[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	function validate(next: CreateTicketFormState): CreateTicketFormErrors {
		const nextErrors: CreateTicketFormErrors = {};
		if (next.title.trim().length < 3) nextErrors.title = 'Title must be at least 3 characters.';
		if (next.description.trim().length < 10)
			nextErrors.description = 'Description must be at least 10 characters.';
		if (!PRIORITIES.includes(next.priority)) nextErrors.priority = 'Please choose a priority.';
		return nextErrors;
	}

	function reset() {
		setForm({ title: '', description: '', priority: 'Medium', assignedAgent: '' });
		setErrors({});
	}

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const nextErrors = validate(form);
		if (Object.values(nextErrors).some(Boolean)) {
			setErrors(nextErrors);
			return;
		}

		try {
			const ticket = await createTicket(form);
			navigate(`/tickets/${ticket.id}`);
			console.log('Created ticket:', ticket);
		} catch (error) {
			console.error('Failed to create ticket:', error);
		}
	}

	return (
		<main className="create-ticket">
			<header className="create-ticket__header">
				<h1>Create Ticket</h1>
				<p>Create a new support ticket (title, description, priority, assignment).</p>
			</header>

			<form className="create-ticket__form" onSubmit={onSubmit} noValidate>
				<TicketFields value={form} errors={errors} onChange={updateField} />

				<div className="actions">
					<button type="submit">Create Ticket</button>
					<button type="button" onClick={reset} disabled={!isDirty}>
						Reset
					</button>
				</div>
			</form>

		</main>
	);
}
