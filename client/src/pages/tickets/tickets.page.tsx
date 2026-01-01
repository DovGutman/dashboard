import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import './tickets.page.css';
import { useTicketsStore } from '@/stores/tickets.store';
import { PRIORITIES, type TicketStatus } from '@/types/create-ticket.types';
import { TicketDetail } from './components/ticket-detail';
import { TicketsFilters } from './components/tickets-filters';
import { TicketsList } from './components/tickets-list';
import type { PriorityFilter, StatusFilter } from './types/tickets.types';
import {
  createTicketsHubConnection,
  TICKETS_HUB_EVENTS,
} from '@/services/realtime/tickets-hub';
import { ticketsApi } from '@/services/api/tickets/tickets.api';

const STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Resolved'];

export default function TicketsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const selectedIdFromRoute = params.id;

  const tickets = useTicketsStore((s) => s.tickets);
  const getTicketById = useTicketsStore((s) => s.getTicketById);
  const updateTicketStatus = useTicketsStore((s) => s.updateTicketStatus);
  const fetchTickets = useTicketsStore((s) => s.fetchTickets);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [hasFetched, setHasFetched] = useState(false);
  const [currentTicket, setCurrentTicket] =
    useState<ReturnType<typeof getTicketById>>(undefined);
  const filtersRef = useRef({ statusFilter, priorityFilter });
  const fetchTicketsRef = useRef(fetchTickets);
  const refreshTimeoutRef = useRef<number | undefined>(undefined);
  const currentTicketIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    filtersRef.current = { statusFilter, priorityFilter };
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTicketsRef.current = fetchTickets;
  }, [fetchTickets]);

  const currentTicketId = useMemo(() => {
    return selectedIdFromRoute ?? tickets[0]?.id;
  }, [selectedIdFromRoute, tickets]);

  useEffect(() => {
    currentTicketIdRef.current = currentTicketId;
  }, [currentTicketId]);

  useEffect(() => {
    if (!currentTicketId) {
      setCurrentTicket(undefined);
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        const ticket = await ticketsApi.getById(currentTicketId);
        if (cancelled) return;
        setCurrentTicket(ticket);
      } catch (error: unknown) {
        if (cancelled) return;
        console.error('Failed to fetch ticket by id:', error);
        setCurrentTicket(undefined);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [currentTicketId]);

  useEffect(() => {
    const connection = createTicketsHubConnection();

    const refresh = () => {
      if (refreshTimeoutRef.current)
        window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = window.setTimeout(() => {
        const { statusFilter: s, priorityFilter: p } = filtersRef.current;
        void (async () => {
          try {
            await fetchTicketsRef.current({
              status: s === 'All' ? undefined : s,
              priority: p === 'All' ? undefined : p,
            });

            const id = currentTicketIdRef.current;
            if (!id) return;
            const updated = await ticketsApi.getById(id);
            setCurrentTicket(updated);
          } catch (error: unknown) {
            console.error(
              'Failed to refresh tickets after SignalR event:',
              error,
            );
          }
        })();
      }, 200);
    };

    for (const eventName of TICKETS_HUB_EVENTS) {
      connection.on(eventName, refresh);
    }

    void connection.start().catch((error) => {
      console.error('SignalR connection failed:', error);
    });

    return () => {
      for (const eventName of TICKETS_HUB_EVENTS) {
        connection.off(eventName, refresh);
      }
      if (refreshTimeoutRef.current)
        window.clearTimeout(refreshTimeoutRef.current);
      void connection.stop();
    };
  }, []);

  useEffect(() => {
    setHasFetched(false);
    void fetchTickets({
      status: statusFilter === 'All' ? undefined : statusFilter,
      priority: priorityFilter === 'All' ? undefined : priorityFilter,
    }).finally(() => setHasFetched(true));
  }, [fetchTickets, statusFilter, priorityFilter]);

  function selectTicket(id: string) {
    navigate(`/tickets/${id}`);
  }

  async function onUpdateStatus(id: string, status: TicketStatus) {
    await updateTicketStatus(id, status);
    await fetchTickets({
      status: statusFilter === 'All' ? undefined : statusFilter,
      priority: priorityFilter === 'All' ? undefined : priorityFilter,
    });
    try {
      const updated = await ticketsApi.getById(id);
      setCurrentTicket(updated);
    } catch (error) {
      console.error(
        'Failed to refresh current ticket after status update:',
        error,
      );
    }
  }

  return (
    <main className="tickets">
      <header className="tickets__header">
        <h1>Tickets</h1>
        <p>
          <Link to="/tickets/new">Create ticket</Link>
        </p>
      </header>

      <div className="tickets__layout">
        <section className="tickets__list" aria-label="All tickets">
          <TicketsFilters
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            setStatusFilter={setStatusFilter}
            setPriorityFilter={setPriorityFilter}
            statuses={STATUSES}
            priorities={PRIORITIES}
          />

          {tickets.length === 0 ? (
            hasFetched &&
            (statusFilter !== 'All' || priorityFilter !== 'All') ? (
              <p>No tickets match these filters.</p>
            ) : (
              <>
                <p>No tickets yet.</p>
                <p>
                  <Link to="/tickets/new">Create your first ticket</Link>
                </p>
              </>
            )
          ) : null}

          <TicketsList
            tickets={tickets}
            selectedTicketId={currentTicketId}
            onSelectTicket={selectTicket}
          />
        </section>

        <section className="tickets__detail" aria-label="Selected ticket">
          <TicketDetail
            ticket={currentTicket}
            statuses={STATUSES}
            onUpdateStatus={onUpdateStatus}
          />
        </section>
      </div>
    </main>
  );
}
