# Local development

This repo contains:
- `client/` (Vite React) calling the backend via `/api/*` and subscribing to realtime events via SignalR on `/hubs/tickets`.
- `DashboardService/` (ASP.NET Core + EF Core + Postgres).

## Prereqs
- Node.js (LTS recommended)
- .NET SDK that supports the repo’s target framework (`net10.0`)
- PostgreSQL 16+ (or Docker)

## Backend setup (.NET)
### 1) Database
Default connection string is configured in [DashboardService/DashboardService/appsettings.json](../DashboardService/DashboardService/appsettings.json).

Docker example:
- `docker run --name dashboard-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16`

If you want to override the DB for EF design-time commands, the DAL factory supports:
- env var `DASHBOARDDB_CONNECTION`

### 2) Apply migrations
Migrations live under `DashboardService.Dal/Migrations`.

Typical flow:
- Install EF tool if needed: `dotnet tool install --global dotnet-ef`
- Update DB:
  - `dotnet ef database update --project DashboardService/DashboardService.Dal/DashboardService.Dal.csproj --startup-project DashboardService/DashboardService/DashboardService.csproj`

### 3) Run the API
- `dotnet run --project DashboardService/DashboardService/DashboardService.csproj`

Dev URLs (from launch settings):
- HTTP: `http://localhost:5131`
- Swagger UI (dev only): `http://localhost:5131/swagger`
- Health: `http://localhost:5131/health`
- SignalR hub: `http://localhost:5131/hubs/tickets`

Notes:
- CORS is enabled only in Development.
- Swagger is enabled only in Development.

## Frontend setup (React)
### 1) Configure env
Copy the template:
- `client/.env.example` → `client/.env.local`

Common local config:
- `VITE_API_BASE_URL=http://localhost:5131`
- `VITE_TICKETS_HUB_PATH=/hubs/tickets`

### 2) Run the client
- `cd client`
- `npm ci`
- `npm run dev`

The Vite dev server proxies:
- `/api` → `VITE_API_BASE_URL`
- `/hubs` (WebSockets) → `VITE_API_BASE_URL`

## Troubleshooting
- If `git add` fails on `.vs/*` files, ensure repo-root [.gitignore](../.gitignore) includes `.vs/` and close Visual Studio.
- If the client can’t reach the API, confirm the backend is running on `http://localhost:5131` and that `VITE_API_BASE_URL` matches.
