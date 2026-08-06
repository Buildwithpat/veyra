# Veyra

Modern Textile Commerce — a premium, AI-assisted B2B marketplace connecting fabric
suppliers and buyers.

This repository is a two-app monorepo (npm workspaces): `client` (React) and `server`
(Express). Marketplace features are not implemented yet — this is the production
foundation they'll be built on.

## Stack

**Client** — React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui (Radix primitives),
React Router, TanStack Query, React Hook Form + Zod, Framer Motion, Axios, Sonner.

**Server** — Node.js, Express, TypeScript (ESM/NodeNext), MongoDB Atlas via Mongoose,
JWT auth, Cloudinary (configured, unused until uploads ship), Zod request validation.

**Deployment** — `render.yaml` defines both services as a Render Blueprint: the client
as a static site, the server as a web service. Database lives on MongoDB Atlas.

## Getting started

```bash
npm install                 # installs both workspaces
cp client/.env.example client/.env.local
cp server/.env.example server/.env
npm run dev                 # runs client (5173) and server (5000) together
```

`server/.env` requires a real `MONGODB_URI` (MongoDB Atlas connection string) and a
`JWT_SECRET` of at least 32 characters — the server validates env vars on boot and
refuses to start without them.

## Architecture

### Client (`client/src`)

```
components/
  ui/         shadcn primitives (Button, Input, Card, ...) — own the design tokens
  layout/     PublicLayout, AuthLayout, DashboardLayout, Navbar, Footer
  shared/     cross-feature building blocks (ProtectedRoute)
features/
  auth/       api calls, Zod schemas, types, hooks — colocated by feature, not by layer
pages/        route-level components, one per URL
providers/    AuthProvider (context + TanStack Query), QueryProvider
routes/       the router tree (react-router v7, data-router style)
lib/          api-client (axios + JWT interceptor), auth-storage, cn()
config/       runtime env validation (fails fast on missing VITE_API_URL)
types/        shared API response shape (ApiSuccess/ApiError)
```

Routing is role-aware: `ProtectedRoute` reads the authenticated user from
`AuthProvider` and redirects unauthenticated users to `/login`, or users with the
wrong role away from a dashboard that isn't theirs. Buyer and supplier both render
through the same `DashboardLayout`, which swaps its nav links by role — one layout,
not two.

Auth state itself is TanStack Query, not a separate store: `AuthProvider` fetches
`/auth/me` (only when a token exists), and login/register mutations update that
query's cache directly. No Redux, no duplicate state.

### Server (`server/src`)

```
config/       env validation (Zod), MongoDB connection, Cloudinary setup
models/       Mongoose schemas (User, with bcrypt password hashing on save)
controllers/  request handlers — thin, validation happens via middleware
routes/       Express routers, mounted under /api
middleware/   requireAuth / requireRole (JWT), centralized error handler
utils/        asyncHandler, ApiError, sendSuccess — consistent response shape
```

Every response is `{ success, data, message }` or `{ success: false, message, errors }`
— the client's `ApiSuccess`/`ApiError` types mirror this exactly. Validation failures
(Zod) and domain errors (`ApiError`) both flow through one `errorHandler`, so routes
never write their own try/catch.

### Design system

Dark-only theme, tokens defined once in `client/src/index.css` as CSS variables (OKLCH
color space) and re-exposed to Tailwind via `@theme inline`. Every shadcn component
consumes these tokens (`bg-card`, `text-muted-foreground`, etc.) instead of hardcoded
colors, so retheming means editing one file. Motion is Framer Motion, kept to
150–300ms fades and slides on page-level content — nothing decorative.

## Scripts

Run from the repo root (each also works inside `client/` or `server/` directly):

- `npm run dev` — both apps, concurrently
- `npm run build` — production build of both
- `npm run lint` — oxlint (client) + eslint (server)
- `npm run format` — Prettier, both apps
