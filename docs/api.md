# API documentation

## Base URLs
Local development (default):
- API: `http://localhost:5131`
- Swagger UI (dev only): `http://localhost:5131/swagger`
- Health: `GET /health`

All REST endpoints are under:
- `/api/Tickets`

## Data contracts
### Enums
`TicketPriority`:
- `Low` (0), `Medium` (1), `High` (2), `Critical` (3)

`TicketStatus`:
- `Open` (0), `InProgress` (1), `Resolved` (2)

### TicketDto
```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "title": "Login page broken",
  "description": "Steps to reproduce...",
  "priority": 2,
  "status": 0,
  "assignedAgentId": "agent-123",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

## REST endpoints
### Create ticket
- `POST /api/Tickets`

Request body (`CreateTicketRequest`):
```json
{
  "title": "Login page broken",
  "description": "Steps to reproduce...",
  "priority": 2,
  "assignedAgentId": "agent-123"
}
```

Responses:
- `201 Created` → `TicketDto`
- `400 Bad Request` if `title`/`description` are missing

### List tickets
- `GET /api/Tickets`

Optional query params:
- `status` (number enum)
- `priority` (number enum)

Example:
- `GET /api/Tickets?status=0&priority=2`

Response:
- `200 OK` → `TicketDto[]`

### Get ticket by id
- `GET /api/Tickets/{id}`

Response:
- `200 OK` → `TicketDto`
- `404 Not Found`

### Update ticket status
- `PATCH /api/Tickets/{id}/status`

Request body (`UpdateTicketStatusRequest`):
```json
{ "status": 1 }
```

Response:
- `200 OK` → updated `TicketDto`
- `404 Not Found`

### Assign ticket
- `PATCH /api/Tickets/{id}/assign`

Request body (`AssignTicketRequest`):
```json
{ "assignedAgentId": "agent-456" }
```

Response:
- `200 OK` → updated `TicketDto`
- `400 Bad Request` if `assignedAgentId` is missing/empty
- `404 Not Found`

## Realtime (SignalR)
### Hub
- Hub path: `/hubs/tickets`

### Events
The server broadcasts these events to all connected clients:
- `tickets.created` (payload: `TicketDto`)
- `tickets.updated` (payload: `TicketDto`)

### Client subscription example (TypeScript)
```ts
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5131/hubs/tickets')
  .withAutomaticReconnect()
  .build();

connection.on('tickets.created', (ticket) => {
  console.log('created', ticket);
});

connection.on('tickets.updated', (ticket) => {
  console.log('updated', ticket);
});

await connection.start();
```

Notes:
- In the Vite dev server, you can use relative `/hubs/tickets` and let the proxy handle it.
