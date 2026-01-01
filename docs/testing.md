# Testing examples

This repo currently focuses on implementation + documentation. This document shows **basic unit testing examples** you can add for key pieces.

## Frontend (React)
Recommended stack:
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom`

Install (from `client/`):
- `npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @types/testing-library__jest-dom`

Add a script to `client/package.json`:
- `"test": "vitest"`

Example component test (conceptual)
```ts
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SelectField } from '@/components/select-field/select-field';

test('renders label and options', () => {
  render(
    <SelectField
      label="Priority"
      value={"High"}
      options={["Low", "Medium", "High"]}
      onChange={() => {}}
    />
  );

  expect(screen.getByText('Priority')).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toBeInTheDocument();
});
```

## Backend (.NET)
Recommended stack:
- xUnit
- FluentAssertions (optional)

Example: unit test the application service (`TicketService`) by using an in-memory EF Core provider or a test Postgres container.

Install approach (one option):
- Create a test project: `dotnet new xunit -n DashboardService.Application.Tests`
- Reference the app projects (`DashboardService.Application`, `DashboardService.Dal`, `DashboardService.Contracts`)

Example unit test (conceptual)
```csharp
using DashboardService.Application.Realtime;
using DashboardService.Application.Tickets;
using DashboardService.Contracts.Tickets;
using DashboardService.Dal;
using Microsoft.EntityFrameworkCore;

public sealed class FakeNotifier : ITicketsNotifier
{
    public List<TicketDto> Created { get; } = new();
    public List<TicketDto> Updated { get; } = new();

    public Task TicketCreatedAsync(TicketDto ticket, CancellationToken cancellationToken)
    {
        Created.Add(ticket);
        return Task.CompletedTask;
    }

    public Task TicketUpdatedAsync(TicketDto ticket, CancellationToken cancellationToken)
    {
        Updated.Add(ticket);
        return Task.CompletedTask;
    }
}

public sealed class TicketServiceTests
{
    [Fact]
    public async Task CreateAsync_trims_fields_and_sets_defaults()
    {
        var options = new DbContextOptionsBuilder<DashboardDbContext>()
            .UseInMemoryDatabase("tickets")
            .Options;

        var notifier = new FakeNotifier();
        await using var db = new DashboardDbContext(options);

        var service = new TicketService(db, notifier);

        var created = await service.CreateAsync(
            new CreateTicketRequest("  Title ", "  Desc ", TicketPriority.High, null),
            CancellationToken.None);

        Assert.Equal("Title", created.Title);
        Assert.Equal("Desc", created.Description);
        Assert.Equal(TicketStatus.Open, created.Status);
        Assert.Single(notifier.Created);
    }
}
```

## If you want, I can wire this up
If you want runnable tests checked into the repo, I can:
- Add Vitest + RTL to `client/` and include 1–2 real tests
- Add a .NET xUnit test project for `DashboardService.Application` and include 1–2 tests for `TicketService`
