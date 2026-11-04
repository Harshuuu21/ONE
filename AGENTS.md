# AGENTS.md – ONE Application Architecture & Development Rules

This document establishes permanent architectural guidelines, conventions, and operational rules for any AI agent or software engineer contributing to **ONE – Your Financial AI Assistant**.

---

## 1. System Architecture Overview

The repository is organized as a decoupled, production-grade full-stack project:

```
ONE/
├── frontend/             # Next.js App Router (TypeScript, Tailwind CSS, Turbopack)
│   ├── public/           # Static public assets
│   ├── src/
│   │   ├── app/          # Pure routing layer (pages, layouts, route handlers, globals.css)
│   │   ├── features/     # Feature-driven modular architecture
│   │   ├── components/   # Cross-cutting reusable UI & layout components
│   │   ├── contexts/     # Global React context providers
│   │   ├── hooks/        # Application-wide reusable hooks
│   │   ├── lib/          # Utilities, configuration, data mocks
│   │   ├── services/     # Shared API clients & adapters
│   │   ├── store/        # Global state stores
│   │   └── types/        # Centralized TypeScript declarations
│   ├── Dockerfile
│   └── package.json
│
├── backend/              # Node.js + Express API (TypeScript, Prisma, Zod, PostgreSQL)
│   ├── src/
│   │   ├── modules/      # Domain modules (auth, users, accounts, transactions, etc.)
│   │   ├── shared/       # Errors, response formatters, shared types
│   │   ├── config/       # Environment & database clients
│   │   ├── middleware/   # Auth, validation, logging, error handling
│   │   ├── routes/       # Top-level API router mounting
│   │   ├── app.ts        # Express app initialization
│   │   └── server.ts     # HTTP server bootstrap & graceful shutdown
│   ├── prisma/           # Prisma schema & migrations
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml    # Multi-container orchestration (Postgres, Redis, Backend, Frontend)
├── AGENTS.md             # This architecture manual
└── README.md             # High-level developer documentation
```

---

## 2. Frontend Architectural Rules (`frontend/`)

### Rule 2.1: Pure Next.js App Router Layer (`src/app/`)
- `src/app/` is strictly a **routing and layout layer**.
- Do **NOT** create feature components, custom hooks, business services, or local types inside `src/app/` subdirectories.
- Every route's `page.tsx` must only import and mount a feature component from `@/features/<feature-name>/components/...`.
- Subdirectories inside `(authenticated)` (e.g., `dashboard/`, `goals/`, `wallet/`) must never nest other feature routes inside themselves. All feature routes are top-level siblings in `(authenticated)`.

### Rule 2.2: Feature-Based Encapsulation (`src/features/`)
Feature-specific code must live entirely within `src/features/<feature-name>/`:
- `components/`: UI components exclusive to this feature.
- `hooks/`: React hooks exclusive to this feature.
- `services/`: API clients, state adapters, or calculations exclusive to this feature.
- `types/`: Domain TypeScript types exclusive to this feature.

Existing features:
- `authentication/` – Login forms, session management, auth services.
- `account-aggregator/` – AA protocol integration, bank linking flows.
- `bank-accounts/` – Account management, mandates, autopay.
- `consent/` – Data sharing consent lifecycle, permissions.
- `dashboard/` – Briefing scene, daily financial summary, journey, reports.
- `wallet/` – Balance views, quick transfers, card management.
- `community/` – Peer lending pool, borrow requests, reputation.
- `goals/` – Savings targets, timeline tracking, milestone progress.
- `trips/` – Trip budget planner, shared travel expenses.
- `savings/` – Transaction history, category breakdown, smart savings.
- `settings/` – Profile settings, security preferences, reputation score.
- `chat/` – Financial AI copilot chat interface.
- `landing/` – Public marketing landing page sections and CTAs.
- `setup/` & `onboarding/` – User initialization and setup flows.

### Rule 2.3: Cross-Cutting Shared Code
- `src/components/ui/`: Atomic design system components (buttons, badges, inputs).
- `src/components/common/`: Common visual items (orbs, progress rings, headers).
- `src/components/layout/`: Global navigation, assistant bars, modal wrappers.
- `src/types/index.ts`: Central type hub re-exporting shared domain entities.
- `src/services/`: Shared network clients and infrastructure adapters.

---

## 3. Backend Architectural Rules (`backend/`)

### Rule 3.1: Modular Domain Architecture (`src/modules/`)
Every business entity is an isolated module inside `src/modules/<domain>/` consisting of:
1. `<domain>.schema.ts`: Zod validation schemas for request body, query, and params.
2. `<domain>.service.ts`: Business logic and Prisma database operations.
3. `<domain>.controller.ts`: Express handler parsing requests and invoking services.
4. `<domain>.routes.ts`: Express router connecting endpoints, validation, and auth guards.

Active backend modules:
- `auth` – User registration, login, JWT token issuance.
- `users` – User profile management and reputation tracking.
- `accounts` – Bank account connection and balance management.
- `transactions` – Financial transaction recording and querying.
- `goals` – Financial goal tracking and progress updates.
- `trips` – Travel budget planning and expense tracking.
- `community` – Peer-to-peer lending requests and community funding.
- `consent` – Open Banking / Account Aggregator consent records.

### Rule 3.2: Middleware Pipeline
- `requestLogger`: Logs HTTP method, URL, status code, and latency.
- `requireAuth`: Validates Bearer JWT tokens and attaches authenticated user data to `req.user`.
- `validateRequest`: Zod-based request validator.
- `errorHandler`: Global error catcher converting `AppError`, `ZodError`, and Prisma errors into consistent JSON responses.

### Rule 3.3: Database & ORM
- PostgreSQL 16 managed via Prisma ORM (`prisma/schema.prisma`).
- Always run `npx prisma generate` after schema updates.
- Use explicit foreign keys with cascade or nullify rules.

---

## 4. Operational & Code Hygiene Rules

1. **Zero Dead Code**: Always remove unreferenced imports, duplicate mock files, and unused directory artifacts.
2. **Type Safety**: Maintain 100% clean TypeScript builds (`tsc --noEmit` must pass with 0 errors).
3. **Graceful Fallbacks**: If external third-party services (Firebase, Open Banking sandbox) are unreachable in offline or development environments, provide deterministic local mock fallbacks to prevent UI crashes.
4. **Never Break Next.js App Router**: Never introduce pages outside of `src/app/` or create conflicting duplicate routes.

