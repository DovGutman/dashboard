import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CreateTicketPage from '@/pages/create-ticket/create-ticket.page';
import TicketsPage from '@/pages/tickets/tickets.page';

export function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/tickets" replace />} />
				<Route path="/tickets" element={<TicketsPage />} />
				<Route path="/tickets/:id" element={<TicketsPage />} />
				<Route path="/tickets/new" element={<CreateTicketPage />} />
			</Routes>
		</BrowserRouter>
	);
}
