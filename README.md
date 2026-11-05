# ONE – Your Financial AI Assistant

An intelligent, privacy-first financial copilot, multi-bank aggregator, and community lending platform designed for modern personal finances.

---

## 🌟 Overview

**ONE** combines automated financial tracking, AI conversational intelligence, multi-bank synchronization, and peer-to-peer community lending into a cohesive operating system. Built with a decoupled full-stack architecture featuring a **Next.js 16** frontend and an **Express + TypeScript + Prisma + PostgreSQL** backend.

---

## 🏗️ Project Architecture

```
ONE/
├── frontend/                     # Next.js 16 App Router (Feature-Based Architecture)
│   ├── src/
│   │   ├── app/                  # Pure routing & layout layer
│   │   │   ├── (authenticated)/  # Protected routes (/dashboard, /wallet, /community, etc.)
│   │   │   ├── (public)/         # Public routes (/, /login, /otp, /aa-gateway)
│   │   │   └── (setup)/          # Step-by-step onboarding wizard (/setup)
│   │   ├── features/             # Feature-driven modular encapsulation
│   │   │   ├── authentication/   # Phone OTP, WebAuthn Passkeys, session handling
│   │   │   ├── account-aggregator/ # AA provider selection, gateway simulation
│   │   │   ├── bank-accounts/    # Multi-bank discovery, linking, portfolio balance
│   │   │   ├── consent/          # ReBIT consent modal, details, audit trail
│   │   │   ├── dashboard/        # Ambient briefing, financial metrics
│   │   │   ├── wallet/           # Combined net worth, bank portfolio
│   │   │   ├── community/        # Peer lending, reputation tracking
│   │   │   ├── goals/            # Savings milestones & deadlines
│   │   │   ├── trips/            # Travel expense planning
│   │   │   ├── savings/          # Categorized transactions, AI insights
│   │   │   ├── settings/         # Profile, connected banks, consent controls
│   │   │   └── chat/             # Context-aware AI financial assistant
│   │   ├── components/           # Cross-cutting UI primitives & layouts
│   │   ├── contexts/             # Global React providers (AuthProvider)
│   │   ├── hooks/                # Application-wide reusable hooks
│   │   ├── middleware.ts         # Edge server session verification & route guard
│   │   ├── services/             # Shared API clients & adapters
│   │   └── types/                # Centralized TypeScript declarations
│   ├── .env.example
│   └── package.json
│
├── backend/                      # Node.js + Express + Prisma ORM + PostgreSQL
│   ├── src/
│   │   ├── modules/              # Modular domain architecture
│   │   │   ├── authentication/   # Mobile OTP, rate limiting, audit logging
│   │   │   ├── passkeys/         # FIDO2 / WebAuthn server registration & login
│   │   │   ├── account-aggregator/ # AA adapters (Sahamati, Setu, OneMoney)
│   │   │   ├── bank-accounts/    # Multi-bank discovery & account linking
│   │   │   ├── consent/          # ReBIT consent lifecycle & event logging
│   │   │   ├── transactions/     # Normalized transactions & deduplication
│   │   │   ├── users/            # User profile & reputation
│   │   │   ├── accounts/         # Internal ledger accounts
│   │   │   ├── goals/            # Savings goals tracking
│   │   │   ├── trips/            # Travel budgets
│   │   │   └── community/        # P2P lending pool & borrow requests
│   │   ├── middleware/           # Auth guard, rate limiting, error handling, logging
│   │   ├── config/               # Environment & database clients
│   │   ├── shared/               # Standardized API response formatters & error classes
│   │   └── server.ts             # Server entrypoint & graceful shutdown
│   ├── prisma/                   # Prisma schema & database migrations
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml            # Multi-container orchestration (PostgreSQL 16, Redis 7, App)
├── AGENTS.md                     # Permanent architectural rules & development manual
└── README.md
```

---

## 🔐 Authentication & Security Architecture

1. **Mobile Number OTP Verification**:
   - Default `+91` country code with 10-digit validation.
   - Built-in rate limiting (5 requests per 5 minutes per IP/phone).
   - In-memory/Redis OTP verification with attempt limits and expiration countdown.
2. **FIDO2 / WebAuthn Passkeys**:
   - Biometric sign-in (Face ID, Touch ID, Windows Hello) via `@simplewebauthn`.
   - Returning users authenticate in 1-click without repeated OTPs.
3. **Session & Cookie Security**:
   - Rotating refresh tokens in `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
   - Edge server validation via Next.js `middleware.ts` preventing unauthenticated access to protected routes.
   - Zero exposure of internal stack traces or secrets in production error responses.

---

## 🏛️ Account Aggregator (AA) & Multi-Bank Integration

- **Regulatory Compliance**: Built strictly against the RBI Master Direction on Account Aggregators and ReBIT FIU Specifications.
- **Provider Abstraction**: Pluggable provider adapter interface (`IAAProvider`):
  - `SAHAMATI_MOCK`: Sahamati sandbox with 28 simulated FIPs.
  - `SETU`: Setu AA Bridge adapter with HMAC/JWS signature validation.
  - `ONEMONEY`: OneMoney (CAMS) adapter.
- **Multi-Bank Discovery & Linking**:
  - Discovers all accounts linked to the user's mobile number across multiple institutions (HDFC, ICICI, SBI, Axis).
  - Single users can connect multiple banks and multiple accounts per bank.
  - Masked account numbers only (`XXXXXXXX4091`); ONE never sees or stores netbanking passwords, PINs, or debit credentials.
- **ReBIT Consent Management**:
  - Independent lifecycle states: `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`, `REVOKED`.
  - Immutable audit trail of every consent event (`ConsentEvent`).
  - Distinguishes between **removing an account from display** (delinking) versus **revoking regulatory AA consent**.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker Compose)

### 1. Environment Setup

#### Backend (`backend/.env`):
```bash
cd backend
cp .env.example .env
```
Key backend variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/one_db?schema=public"
JWT_SECRET="one_access_secret_key_change_in_production"
JWT_REFRESH_SECRET="one_refresh_secret_key_change_in_production"
RP_NAME="ONE Financial Assistant"
RP_ID="localhost"
ORIGIN="http://localhost:3000"
AA_MOCK_SANDBOX_ENABLED=true
```

#### Frontend (`frontend/.env.local`):
```bash
cd frontend
cp .env.example .env.local
```
Key frontend variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AA_GATEWAY_URL=http://localhost:3000/aa-gateway
NEXT_PUBLIC_WEBAUTHN_ORIGIN=http://localhost:3000
```

---

### 2. Running with Docker Compose (Recommended)

```bash
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- API Health Check: [http://localhost:5000/health](http://localhost:5000/health)

---

### 3. Running Locally (Manual Commands)

#### Step A: Start Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

#### Step B: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to experience ONE.

---

## 🧪 Testing Commands

- **Backend Type Check**:
  ```bash
  cd backend && npx tsc --noEmit
  ```
- **Backend Production Build**:
  ```bash
  cd backend && npm run build
  ```
- **Frontend Type Check**:
  ```bash
  cd frontend && npx tsc --noEmit
  ```
- **Frontend Production Build**:
  ```bash
  cd frontend && npm run build
  ```

---

## 📜 Development Conventions

All future contributions must follow the architectural guidelines defined in [AGENTS.md](./AGENTS.md):
- Zero dead code policy.
- Feature logic strictly encapsulated inside `src/features/<feature>/`.
- Routing only inside `src/app/`.
- 100% clean TypeScript builds with 0 compile errors.
