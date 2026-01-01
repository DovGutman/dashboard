# Dashboard (React + .NET)

Full-stack sample dashboard:
- **Frontend**: React + TypeScript (Vite)
- **Backend**: ASP.NET Core (.NET) + EF Core + PostgreSQL
- **Realtime**: SignalR hub broadcasting ticket updates

## Repo layout
- `client/` – React app
- `DashboardService/` – .NET solution/projects (API, Application, Contracts, DAL)
- `docs/` – setup, ADR, API, testing docs

## Quickstart (local dev)
1. Start PostgreSQL (Docker example)
   - `docker run --name dashboard-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16`

2. Start the backend API
   - `dotnet run --project DashboardService/DashboardService/DashboardService.csproj`
   - Swagger UI (dev): `http://localhost:5131/swagger`
   - Health: `http://localhost:5131/health`

3. Start the frontend
   - `cd client`
   - `npm ci`
   - `npm run dev`

The Vite dev server proxies `/api` and `/hubs` to the backend.

## Documentation
- Local setup: [docs/local-development.md](docs/local-development.md)
- Architecture decision record (ADR): [docs/adr/0001-architecture.md](docs/adr/0001-architecture.md)
- API + realtime docs: [docs/api.md](docs/api.md)
- Testing examples: [docs/testing.md](docs/testing.md)
