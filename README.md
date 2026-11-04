# ONE – Your Financial AI Assistant

An intelligent, privacy-first financial copilot and community lending platform designed for modern personal finances.

---

## 🌟 Overview

ONE combines automated financial tracking, AI conversational intelligence, and peer-to-peer community lending into a cohesive operating system. Built with a decoupled full-stack architecture featuring a **Next.js 16** frontend and an **Express + TypeScript + Prisma** backend.

---

## 🏗️ Architecture

```
ONE/
├── frontend/             # Next.js 16 App Router with Feature-Based Architecture
│   ├── src/
│   │   ├── app/          # Pure routing layer (pages, layouts)
│   │   ├── features/     # Encapsulated feature domains
│   │   ├── components/   # Shared UI & design system components
│   │   ├── contexts/     # Application context providers
│   │   ├── hooks/        # Shared utility hooks
│   │   ├── lib/          # Helper utilities & configuration
│   │   ├── services/     # Shared API clients & adapters
│   │   ├── store/        # Client state stores
│   │   └── types/        # Centralized TypeScript types
│   └── package.json
│
├── backend/              # Node.js + Express + Prisma ORM + PostgreSQL
│   ├── src/
│   │   ├── modules/      # Modular domains (auth, users, accounts, transactions, goals, trips, community, consent)
│   │   ├── shared/       # Error handling, API response formatters, types
│   │   ├── config/       # Environment & database configuration
│   │   ├── middleware/   # Authentication, Zod validation, logging, errors
│   │   ├── routes/       # Top-level API router
│   │   ├── app.ts        # Express application setup
│   │   └── server.ts     # HTTP server entrypoint
│   ├── prisma/           # Database schema & migrations
│   └── package.json
│
├── docker-compose.yml    # PostgreSQL 16, Redis 7, Backend & Frontend
├── AGENTS.md             # Architectural rules & AI agent guidelines
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker](https://www.docker.com/) & Docker Compose (optional for local DB & containers)

---

### Running with Docker Compose

To spin up the entire stack including PostgreSQL, Redis, backend, and frontend:

```bash
docker-compose up --build
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health**: [http://localhost:5000/health](http://localhost:5000/health)

---

### Running Locally (Manual Setup)

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client & run migrations
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Architecture & Contributing Guidelines

For detailed guidelines on adding new features, code hygiene, and strict architectural rules, see [AGENTS.md](./AGENTS.md).
