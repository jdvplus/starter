# Starter

A production-grade full-stack starter template built for speed, durability, and extensibility. Clone it, build on it, ship something.

## Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Client       | React 19, TypeScript 6, Tailwind CSS 4, TanStack Query |
| Server       | Node.js, Express 5, Winston, Morgan                    |
| Build        | Vite 8, SWC                                            |
| Testing      | Vitest, Testing Library                                |
| Code Quality | ESLint, Prettier, Husky, lint-staged                   |

## Project Structure

```
starter/
├── client/                     # React frontend
│   ├── hooks/                  # Custom hooks (TanStack Query patterns)
│   ├── lib/                    # API client
│   ├── providers/              # React context providers
│   ├── test/                   # Test setup
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── tailwind.css            # Theme and design tokens
├── server/                     # Express backend
│   ├── api/                    # Route definitions
│   ├── constants/              # Centralized constants (endpoints, etc.)
│   ├── lib/                    # Core utilities (logger, error classes)
│   ├── middleware/             # Express middleware (security, errors, logging)
│   └── services/               # Business logic layer
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── vitest.config.ts            # Test configuration
├── tsconfig.json               # TypeScript project references (root)
├── tsconfig.app.json           # TypeScript config (client)
└── tsconfig.node.json          # TypeScript config (server)
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start both client and server in development
pnpm dev
```

The client runs on `http://localhost:5173` with hot reload.

The server runs on `http://localhost:3000` with file watching. API requests from the client are proxied to the server automatically.

## Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start client + server concurrently  |
| `pnpm dev:client`   | Start Vite dev server only          |
| `pnpm dev:server`   | Start Express server only           |
| `pnpm build`        | Type-check and build for production |
| `pnpm start`        | Run the production server           |
| `pnpm preview`      | Build and start production locally  |
| `pnpm test`         | Run all tests                       |
| `pnpm test:watch`   | Run tests in watch mode             |
| `pnpm lint`         | Lint all files with ESLint          |
| `pnpm lint:fix`     | Lint and auto-fix issues            |
| `pnpm format`       | Format all files with Prettier      |
| `pnpm format:check` | Check formatting without writing    |

## Architecture Decisions

### Server

**Service Layer Pattern** — Routes are thin. Business logic lives in `server/services/`, keeping route handlers focused on request/response. This makes logic reusable and testable independent of Express.

**Centralized Error Handling** — Three tiers of errors handled by a single middleware:

1. `AppError` — intentional errors thrown in your code (`AppError.notFound()`, `AppError.unauthorized()`, etc.) with status, message, and optional error code
2. Library errors — Express/middleware errors that carry a status (JSON parse failures, payload too large)
3. Unexpected errors — logged server-side, details hidden in production

**Structured Logging** — Winston for application logs with environment-aware log levels. Morgan splits HTTP request logs into success (info) and error (warn) streams. No raw `console.log` anywhere.

**Security Middleware** — Helmet for headers, CORS configured per environment, rate limiting on API routes (100 requests / 15 minutes per IP).

**Graceful Shutdown** — `SIGINT` and `SIGTERM` handlers close the server cleanly with a 10-second timeout. Add database/queue cleanup in the shutdown function as you scale.

### Client

**API Client** — A typed `fetch` wrapper (`client/lib/api.ts`) that pairs with the server's error format. Non-2xx responses throw `ApiError` with status, message, and code. Usage:

```ts
const users = await api.get<User[]>('/api/users')
const user = await api.post<User>('/api/users', { name: 'Jane' })
```

**TanStack Query** — Pre-configured with a `QueryProvider` and sensible defaults (60s stale time, 1 retry). The `useHealth` hook demonstrates the pattern:

```ts
// hooks/useHealth.ts
export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => api.get<HealthStatus>('/api/health'),
  })
}

// In a component
const { data, isLoading, error } = useHealth()
```

Create a hook per resource, call `api` methods inside `queryFn`, and the component gets loading/error states for free.

### Testing

**Vitest + Testing Library** — Tests live next to the code they test (`*.test.ts` / `*.test.tsx`). Pattern established:

- Logic tests — mock `fetch`, call functions, assert behavior (`api.test.ts`)

### Code Quality

**ESLint** catches bugs and enforces best practices — TypeScript-aware rules, React hooks validation, and Vite HMR safety checks. Uses ESLint 9's flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. Formatting rules are disabled via `eslint-config-prettier` so ESLint and Prettier never conflict.

**Prettier** runs on every commit via Husky + lint-staged. No style debates, no formatting drift. Configuration matches production conventions (no semicolons, single quotes, trailing commas).

Both run automatically on pre-commit via lint-staged — ESLint auto-fixes first, then Prettier formats.

## Environment Variables

| Variable        | Default                 | Description                                          |
| --------------- | ----------------------- | ---------------------------------------------------- |
| `PORT`          | `3000`                  | Server port                                          |
| `NODE_ENV`      | `development`           | Environment mode                                     |
| `LOG_LEVEL`     | `debug`                 | Winston log level (`debug`, `info`, `warn`, `error`) |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin in development                   |

## Adding a New Feature

A typical feature touches four places:

1. **`server/services/`** — Add business logic
2. **`server/api/`** — Add route that calls the service
3. **`client/hooks/`** — Add a TanStack Query hook that calls `api`
4. **`client/components/`** — Build the UI that uses the hook

Keep routes thin, logic in services, data fetching in hooks, and rendering in components.
