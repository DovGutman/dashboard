# ADR 0001: Architecture & key technical choices

Date: 2026-01-01

## Context
We need a small full-stack dashboard that can:
- Create and list tickets via an HTTP API
- Update ticket status/assignment
- Push live updates to connected clients
- Stay easy to run locally and easy to evolve

## Decision
### Frontend
- **React + TypeScript + Vite**
  - Fast local dev and modern TS ergonomics.
- **Axios** for HTTP calls
  - Small, familiar request/response layer.
- **Zustand** for client state
  - Lightweight state container suitable for a small app without heavy boilerplate.
- **SignalR JS client** for realtime updates
  - Matches ASP.NET Core SignalR server.

### Backend
- **ASP.NET Core Web API** using controllers
  - Clear HTTP contract surface and compatibility with Swagger.
- **EF Core + PostgreSQL** for persistence
  - Simple relational model with migrations and local dev friendliness.
- **SignalR hub** for broadcasting ticket changes
  - Server emits `tickets.created` and `tickets.updated` with `TicketDto` payloads.

### Project structure
- **Contracts** project (`DashboardService.Contracts`) contains DTOs + request models
  - Keeps API contracts shareable and versionable.
- **Application** project (`DashboardService.Application`) contains ticket domain logic
  - Keeps controller thin and supports testability.
- **DAL** project (`DashboardService.Dal`) contains EF Core DbContext + migrations
  - Keeps persistence concerns isolated.

## Consequences
### Positive
- Clear separation of concerns (Controller → Application → DAL)
- Realtime support without polling
- Swagger UI in development for discovery

### Tradeoffs
- EF Core introduces migration management overhead
- SignalR adds a second integration surface (hub + events)
- Contracts-as-code means DTO changes ripple to both client + server

## Alternatives considered
- **Polling instead of SignalR**: simpler operationally, worse UX and higher API load.
- **Redux Toolkit instead of Zustand**: more structure, more boilerplate for this scope.
- **Minimal APIs instead of controllers**: valid option, but controllers keep the REST surface conventional and easy to document.
