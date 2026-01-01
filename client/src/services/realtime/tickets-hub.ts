import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from '@microsoft/signalr';

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function getTicketsHubUrl() {
  const baseUrl =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  const hubPath =
    (import.meta.env.VITE_TICKETS_HUB_PATH as string | undefined) ??
    '/hubs/tickets';

  // // In dev, prefer same-origin so Vite can proxy both HTTP and WS.
  // if (import.meta.env.DEV) return hubPath;

  // If no baseUrl is provided, use relative path (same-origin, works with a dev proxy).
  if (!baseUrl) return hubPath;
  return joinUrl(baseUrl, hubPath);
}

export const TICKETS_HUB_EVENTS = [
  'tickets.created',
  'tickets.updated',
] as const;

export function createTicketsHubConnection(): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(getTicketsHubUrl(), {
      transport: HttpTransportType.WebSockets,
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}
