# Veyra — Project Inventory

Factual snapshot of the current implementation, organized by application area. Each section lists what is implemented, relevant UX behavior, where the data actually comes from, and anything structurally atypical for a marketplace app.

---

## Landing Page

**Features implemented**
- Hero section: 5 asymmetric, rotating fabric tiles (`hero-section.tsx`)
- Fabric-library wall: 12-tile CSS-column masonry layout
- Marketplace preview: grid of 4 featured product cards
- AI-sourcing search demo: live search box that queries real product data and re-ranks results
- "How it works": 4-step illustrated flow (static content)
- Global sourcing map: 7 hardcoded sourcing regions (static, not DB-driven)
- "Why choose Veyra": 8-card capability grid
- FAQ accordion (static content from `data/faqs.ts`)
- CTA section

**Important UX details**
- Hero, fabric-library, and marketplace-preview sections all gate on `useFeaturedProducts()` `isPending` with skeletons, then decide real-vs-fallback data once via `useMemo` — deliberately avoids a mid-load remount/re-animation "pop."
- AI-search demo has an artificial minimum "thinking" delay (`MIN_THINKING_MS = 900`) with two staged status lines, independent of actual query latency.
- Landing copy is conditional on whether fallback data is being shown (`usingFallback` flag) — claims like "no placeholders" only render when that's actually true.
- "AI Match Score" badges shown throughout (why-choose section, cards) render as a small non-numeric signal visualization rather than an unverified specific percentage.

**Data source**
- Hero, fabric-library, marketplace-preview: real DB via `useFeaturedProducts()` → `GET /products`, backfilled with hardcoded `fallbackProducts` when the DB returns fewer items than needed.
- AI-search demo: real DB via a live `fetchProducts()` call; falls back to the same hardcoded `fallbackProducts` pool if the live query returns nothing.
- Global sourcing map, "how it works" copy, FAQ: fully static/hardcoded, not DB-driven.

**Anything unique compared to a typical marketplace**
- The "AI Match Score" used across the landing page is a deterministic formula over real product fields (`lib/match-score.ts`), not an ML/LLM output, despite the "AI" framing.

---

## Authentication

**Features implemented**
- Register (name/email/password/role), bcrypt cost-12 password hashing
- Login, logout, `GET /auth/me`
- Forgot/reset password via a 6-digit OTP: `crypto.randomInt`-generated, SHA-256-hashed at rest, 10-minute expiry, single-page inline flow (request email → code shown on screen → enter code + new password, all on `/forgot-password`, no separate reset-link page)
- Login page has a Buyer/Supplier segmented role toggle that determines which demo account gets prefilled and signed in when the demo button is used
- JWT access token (`jsonwebtoken`), stored in `localStorage`, attached as `Authorization: Bearer <token>` via an Axios request interceptor; a response interceptor clears the token on any 401
- Server-side `requireAuth`/`requireRole` middleware gates protected and role-specific routes

**Important UX details**
- Zod validation on both client and server (email format, password strength policy) with inline field errors
- Framer-motion staggered field entrance animation on login and forgot-password
- Demo-login button visibly fills the email/password fields via `setValue` before submitting, then shows a "Signing in..." pending state
- Post-login redirect uses the authenticated account's real `role` field (not the toggle selection) to land on `/dashboard` or `/supplier/dashboard`

**Data source**
- Real DB (`User` model) for all auth operations via `server/src/controllers/auth.controller.ts`

**Anything unique compared to a typical marketplace**
- None structurally — standard JWT/localStorage auth.

**Known gaps**
- `forgotPassword` only returns the OTP in the API response when `NODE_ENV !== "production"`. `render.yaml` sets `NODE_ENV=production` on the deployed API, so the on-screen OTP flow works when running the server locally in dev, but **not on the deployed URL** — in production the OTP is only written to the server's console log.
- No email verification step. No admin role in the schema (`role` is `"buyer" | "supplier"` only).

---

## Buyer Onboarding

**Features implemented**
- Single-page (non-wizard) form: Business type & Industry (`<Select>` with free-text "Other" fallback), Product interests + Preferred fabric categories (two independent checkbox groups), Budget range & MOQ preference (`<Select>`, static option lists)
- One submit → `PATCH /users/me` with `completeOnboarding: true`

**Important UX details**
- "Other" selections correctly re-populate their free-text field on edit if a saved value doesn't match a known option
- No multi-step progress indicator — one form, one submit

**Data source**
- Categories (used for both "Product interests" and "Preferred fabric categories") are real DB via `Category` model / `GET /categories`
- Budget range, MOQ preference, business type, industry option lists are hardcoded constants
- Profile write goes to `User.buyerProfile` subdocument via `PATCH /users/me`

**Anything unique compared to a typical marketplace**
- None notable.

**Known gaps**
- "Product interests" and "Preferred fabric categories" are two separate fields backed by the identical category list, with no visible distinction in purpose.

---

## Supplier Onboarding

**Features implemented**
- Single-page form: business name, description, phone, operating hours, full address (line 1/2, city, state, postal, country), fabric categories supplied (checkboxes), typical MOQ
- Submits to the same `PATCH /users/me` with `completeOnboarding: true`, redirects to `/supplier/dashboard`

**Important UX details**
- No logo/file upload at onboarding time (product images are handled later, in inventory)
- No address validation/autocomplete — plain text fields

**Data source**
- Real DB (`User.supplierProfile` subdocument). Categories list is real DB; all other fields are free text.

**Anything unique compared to a typical marketplace**
- None notable.

**Known gaps**
- Supplier categories are stored as category **IDs** here, vs. category **names** on the buyer-onboarding side — inconsistent representation between the two forms.
- `SupplierProfile.verified` defaults to `false`, and no application code path ever sets it to `true` — only the seed script hardcodes `verified: true` for its 7 fabricated demo suppliers. A self-registered supplier has no route to ever become "Verified"; there's no admin/moderation flow.

---

## Marketplace

**Features implemented**
- Infinite-scroll pagination (`useInfiniteQuery`, `PAGE_SIZE = 12` server-side) via an intersection-observer trigger
- Server-side filtering: category, color, price range, MOQ max, availability, full-text search (Mongo `$text`)
- Sort: relevance (text score, or featured+rating when there's no search term), price asc/desc, newest, rating — every sort branch has `_id: 1` as a tiebreaker so skip/limit pagination stays deterministic across page boundaries
- Client-side defensive dedup by product id on top of the server-side fix, in case of stray duplicates
- 3 view modes: large / compact / masonry grid
- Compare tray, max 3 products, side-by-side spec comparison dialog
- Product preview dialog (quick-view without navigating away)
- Natural-language search bar: debounced (300ms) live filtering, recent-searches (localStorage, capped at 5), example-prompt suggestions, inline price-constraint parsing (regex-based, not an LLM call)
- Server-side filter-options endpoint aggregates real min/max price, min/max MOQ, and distinct colors from the DB to bound the filter UI

**Important UX details**
- Skeleton grid while pending; distinct error state (icon + Retry button calling `refetch()`) vs. distinct empty state ("Clear search & filters" action) — not conflated
- `framer-motion` `layout` + `AnimatePresence` on the grid for add/remove transitions
- Fetching the next page appends 3 more skeletons below existing results

**Data source**
- Real DB reads via `Product.find()`, populated with `category` and `supplier`. No fallback/mock data on this page — an empty or errored query shows an explicit state rather than synthesizing products.

**Anything unique compared to a typical marketplace**
- The compare tray (max 3, full spec table) and the deterministic tiebreaker fix for pagination stability are more considered than a typical hackathon-scope listing grid.

---

## Product Detail Page

**Features implemented**
- Image gallery, spec table, supplier card, breadcrumb (Marketplace → category → product name)
- "AI Fabric Insights" card: 2–3 bullet points generated by deterministic rules over real product fields (GSM thresholds, composition keyword matches, sustainability tags, price/MOQ heuristics) — **not an LLM call**
- "Ask a follow-up" button opens the AI assistant panel seeded with the product's slug as context — this handoff does reach the real AI backend
- Similar-products section (same category, rating-sorted, default limit 4, max 20)

**Important UX details**
- Skeleton (image + text blocks) while pending
- Distinct "Fabric not found" empty state with a back-to-marketplace action, for a bad/unknown slug

**Data source**
- Real DB via `getProductBySlug` and `getSimilarProducts`. No fallback data on this page.

**Anything unique compared to a typical marketplace**
- None beyond the assistant hand-off.

---

## AI Assistant

**Features implemented**
- Real Server-Sent-Events streaming chat (`POST /assistant/chat`, `text/event-stream`, native `fetch` + `ReadableStream` on the client)
- Server pipeline: parse intent from the question → retrieve real products from MongoDB (text search + structured filters, or scoped to the current product/compare-slug context when opened from a product page or compare tray) → generate a response → stream it back
- Provider abstraction supports 4 real LLM backends — OpenAI, Groq, HuggingFace (all via one OpenAI-compatible client), and Gemini (dedicated client) — selected via `AI_PROVIDER`/`AI_MODEL` env vars
- **Confirmed in this project's server configuration: `AI_PROVIDER=gemini`, `AI_MODEL=gemini-2.5-flash`, with a real `GEMINI_API_KEY` set** — chat responses are genuine Gemini completions grounded on retrieved product data
- Graceful degradation: if no provider/key is configured, the service falls back to a deterministic, data-grounded template response, artificially streamed word-by-word (18ms/word) so the UI behaves identically either way
- Suggested follow-up prompts generated per response
- Source cards showing the real products the answer was grounded in
- Context-seeding: "Ask AI" entry points from product cards, product detail, and the compare tray pass a product slug or compare-slug list, which retrieval prioritizes over re-parsing free text

**Important UX details**
- Slide-in side panel (`Sheet`), empty state with starter prompts, streaming indicator, per-message retry on error, panel context resets on every open, auto-scroll to latest message

**Data source**
- Live LLM API call (Gemini, confirmed configured) grounded in real MongoDB product data via retrieval, with a fully functional non-LLM deterministic fallback path if no API key is present. Not mocked.

**Anything unique compared to a typical marketplace**
- The retrieval step scopes to whatever product/comparison the user was already viewing rather than always re-deriving from free text, and the entire feature has a real working no-API-key fallback mode using the identical streaming UI either way — more architecture than a typical hackathon AI chat bolt-on.

---

## Cart

**Features implemented**
- Add item (merges quantity if the product is already in the cart)
- Update quantity (floor-clamped to the product's MOQ)
- Remove item, clear cart
- Cart drawer (slide-out) and a full `/cart` page
- Cart icon badge (line-item count, capped display at "99+")

**Important UX details**
- Badge intentionally counts line items, not total meters/units, so it doesn't read as a huge order
- Drawer and full page both show an empty state when the cart is empty
- Cart summary includes a static disclaimer: "Freight, duties and taxes are calculated at checkout"

**Data source**
- Client-only, `localStorage` (key `veyra_cart`). Not persisted server-side, not tied to a DB collection — cart contents are lost on storage clear and aren't shared across devices/sessions.

**Anything unique compared to a typical marketplace**
- None — standard client-cart pattern.

---

## Checkout

**Features implemented**
- Shipping form (name, phone with country-code select, address lines, city/state/postal/country)
- Order placement, then redirect to the new order's detail page

**Important UX details**
- Empty-cart guard redirects to an empty state
- If the server reports an item is no longer available, that specific item is automatically removed from the cart client-side rather than leaving checkout stuck
- Explicit "This is a preview checkout — no payment is collected" disclaimer under the submit button

**Data source**
- Real DB write via order creation. The server re-derives price and subtotal from the live product record (never trusts client-submitted price/subtotal) and rejects any item below the product's current MOQ.

**Anything unique compared to a typical marketplace**
- Server-side price/MOQ re-validation at order time, preventing a stale or tampered cart from checking out at an incorrect price — a real integrity check, not assumed.

---

## Buyer Dashboard

**Features implemented**
- Welcome header
- 4 stat tiles: Total orders, Active orders (status ≠ completed), Total spent, Suppliers sourced from (distinct supplier count across order items)
- 3-card quick-actions row: Browse marketplace, Track orders, Ask Veyra AI (opens the assistant panel)
- Recent orders list (latest 3)
- Orders page with Current/History tabs (History = completed orders), each with its own loading/error/empty state

**Important UX details**
- Skeleton loaders for stats and order list while pending
- Distinct error state (icon + Retry button) vs. distinct empty state (message + CTA to marketplace) — these are separate branches, not conflated
- Sidebar layout is fixed height (`h-svh overflow-hidden` shell, sidebar and mobile header `shrink-0`); only the main content area scrolls independently

**Data source**
- Entirely client-computed from the buyer's order list (`GET /orders`, real `Order` collection, buyer-scoped) — no separate stats endpoint on the buyer side, unlike the supplier dashboard.

**Anything unique compared to a typical marketplace**
- None notable.

---

## Supplier Dashboard

**Features implemented**
- Welcome header
- First stat row (from a dedicated stats endpoint): Total products, Active products, Inventory alerts (availability = "limited"), Profile completion %
- Second stat row (computed client-side): Total revenue, Pending orders, Avg. order value
- "Orders by status" breakdown card (counts per status across all 5 statuses)
- Conditional "Finish your business profile" card with a progress bar, shown only when completion is under 100%
- Recent orders list (server-limited to 5)

**Important UX details**
- A top-level error check renders a full-page error state with Retry before anything else renders, rather than per-section error handling
- Skeletons for both stat rows and the order list while pending
- "Orders by status" card only renders if there's at least one order
- Same fixed-sidebar/scrollable-content layout as the buyer dashboard

**Data source**
- First stat row, recent orders, and profile completion from a dedicated supplier stats endpoint (real `Product.countDocuments` + `Order.find` queries, plus a computed profile-completion percentage)
- Second stat row and status breakdown computed client-side from the supplier's full incoming-orders list (all orders containing this supplier's items, no limit)

**Anything unique compared to a typical marketplace**
- The profile-completion nudge is a concretely computed percentage, not a decorative placeholder value.

---

## Inventory Management

**Features implemented**
- Product list with per-row toggle-active (soft hide/show a listing) and delete (confirmation dialog, "This can't be undone")
- Add/edit product form — one shared component for both create and edit flows
- Image uploader, available on the edit page only (upload requires an existing product id)

**Important UX details**
- Empty state with an "Add product" call-to-action when inventory is empty
- Skeleton rows while loading
- Image uploader: 5MB client-side size gate before upload, hover-to-reveal remove button per image, "first image is the primary listing photo" hint text
- New-product flow navigates straight to the edit page after creation, since photos can't be attached until the product exists

**Data source**
- Real DB — product create/update/delete write to the `Product` collection; ownership is enforced server-side on update/delete/image endpoints (a supplier can only modify their own products)
- Images upload to Cloudinary (folder `veyra/products`, transformed to width 1600 / auto quality / auto format); URLs are pushed into the product's `images[]` array. Deleting an image only removes the URL reference — it does not delete the asset from Cloudinary.

**Anything unique compared to a typical marketplace**
- None — standard seller-inventory CRUD.

---

## Order Management

**Features implemented**
- Buyer side: order detail page (items, shipping address, total); read-only, no status controls
- Supplier side: incoming-orders list (all orders containing their products), order detail page scoped to only that supplier's own line items within a (possibly multi-supplier) order, a status-update control

**Important UX details**
- The status-update control disables status options earlier than the current one in the UI, as a guard against moving status backward
- Both buyer and supplier order-detail pages show a skeleton while pending and an empty state for "not found," but (per the polish-pass audit) don't distinguish a genuine fetch error from a real 404 — both currently collapse to the same "Order not found" message

**Data source**
- Real `Order` collection. Supplier views are scoped to `{"items.supplierId": supplierId}` and filtered so a supplier only ever sees and is billed for their own line items within an order, never the buyer's full order across other suppliers.

**Anything unique compared to a typical marketplace**
- The order-splitting-by-supplier view is a genuine multi-vendor mechanic (per-supplier line-item scoping and subtotal), not a single-seller order list re-skinned.

**Known gap**
- The backward-status-move restriction is UI-only — the server's status-update endpoint accepts any valid status value with no server-side transition validation, so the forward-only rule is not enforced end-to-end.

---

## Demo Accounts

All accounts below are created by `server/src/scripts/run-seed.ts` (`npm run seed`, run from `server/`). This script wipes and reloads the `Category`, `Product`, seeded `User`, and seeded `Order` collections — it is destructive to whatever database `MONGODB_URI` points at.

**Buyer account**
- Email: `demo.buyer@veyra.dev`
- Password: `DemoBuyer123!`
- Role: `buyer`
- Has 5 seeded orders (see below)

**Supplier accounts** (7 total, all password `Supplier123!`, role `supplier`)
- `contact@anantaratextiles.example` — Anantara Textile Mills — **this is the account the login page's "Demo seller" button uses**; receives 2 of the 5 seeded orders
- `contact@hangzhousilk.example` — Hangzhou Silk Union — receives 1 seeded order
- `contact@filatidicomo.example` — Filati di Como — no seeded orders
- `contact@egedenim.example` — Ege Denim Co. — receives 2 of the 5 seeded orders
- `contact@portolinen.example` — Porto Linen Works — no seeded orders
- `contact@carolinaperformance.example` — Carolina Performance Fabrics — no seeded orders
- `contact@dhakaknit.example` — Dhaka Knit Collective — no seeded orders

**No admin role exists anywhere in the schema** (`User.role` is `"buyer" | "supplier"` only).

**Seeded orders** (5 total, all placed by the demo buyer, one item each)
| Product | Status | Age | Supplier |
|---|---|---|---|
| Combed Cotton Poplin | completed | 34 days ago | Anantara Textile Mills |
| 14oz Raw Selvedge Denim | completed | 21 days ago | Ege Denim Co. |
| Mulberry Silk Charmeuse | ready-for-dispatch | 9 days ago | Hangzhou Silk Union |
| Organic Cotton Canvas | preparing | 5 days ago | Anantara Textile Mills |
| Stretch Denim (light) | pending | 1 day ago | Ege Denim Co. |

**One-click login**: the login page has a Buyer/Supplier role toggle and a "Sign in as demo buyer/supplier" button that fills the matching credentials above and signs in immediately — no manual typing required for a demo.

**Also seeded**: 8 product categories, ~29 products distributed across the 7 suppliers.

---

## Technical Architecture

**Monorepo**: npm workspaces (root `package.json`, `workspaces: ["client", "server"]`); root `dev` script runs both apps concurrently.

**Frontend** (`client/`): React 19, React Router 7 (data router via `createBrowserRouter`), TanStack React Query 5 for server state, React Hook Form + Zod for forms, Tailwind CSS 4, Framer Motion 12 for animation, Radix UI primitives wrapped as shadcn-style components, Axios for HTTP, Vite 8 build tool, TypeScript ~6.0.2, `oxlint` for linting.

**Backend** (`server/`): Express 4.21, Node ≥20, MongoDB via Mongoose 8.9, TypeScript 5.7 (ESM, `tsc` build, `tsx watch` for dev). 4 Mongoose models: `Category`, `Order`, `Product`, `User`.

**Auth mechanism**: JWT via `jsonwebtoken`, not cookie-based sessions. Client stores the access token in `localStorage` and attaches it as a bearer token via an Axios request interceptor; a response interceptor clears the token on any 401. Server-side `requireAuth`/`requireRole` middleware verifies the token and gates role-specific routes.

**Client↔server wiring**: client calls a configured API base URL; server CORS is locked to a single origin via the `CLIENT_URL` env var — this must exactly match the client's actual running port, or every API call is silently CORS-blocked.

**Middleware stack** (in order): `helmet()`, `compression()`, `cors()`, `express.json()`, `morgan` request logging, two `express-rate-limit` limiters scoped to login/register (20 req/15min) and assistant chat (20 req/min), the API router, then not-found and error handlers.

**Env validation**: server env vars are parsed through a Zod schema at startup and the process throws/exits if invalid, rather than running with bad config.

**App-shell boot loader**: the real app mounts immediately; a full-screen overlay loader is layered on top and fades out once three gates are all true — auth resolution, the landing page's featured-products query settling, and web fonts loading — and a 3-second minimum has elapsed, then fades over 500ms before unmounting. Shown once per browser tab via a `sessionStorage` flag (a same-tab refresh skips it; a new tab/session shows it again).

---

## AI Features

Two independent AI-adjacent systems exist in the codebase — they should not be conflated:

**1. AI Marketplace Assistant (chat panel)** — real, optional LLM integration. A provider abstraction selects from OpenAI, Groq, HuggingFace, or Gemini based on env config; if no provider/key is set, the service falls back to a deterministic, data-grounded template response streamed at a fixed pace so the UI behaves identically either way. This project's configured environment uses Gemini (`gemini-2.5-flash`) with a real API key, so assistant responses are genuine model completions grounded in retrieved product data — not canned text — in this deployment. All responses (real or template) cite real Mongo documents via the retrieval step, so "sources" shown in the UI are never fabricated.

**2. "AI Match Score"** (badges shown across marketplace cards and landing sections) — **not AI/ML**. It's a fixed deterministic formula over real product fields (base score + rating weight + verified-supplier bonus + certification count + availability), clamped to a range. A second deterministic formula, paired with a regex-based keyword/price/GSM/color extractor, powers the free-text "sourcing brief" matching on the landing page's AI-search demo. No LLM call, no embeddings, no model inference involved in either.

**Landing page "AI Sourcing Demo"**: the search itself is live — it calls the real product-search endpoint against the actual database — but the "AI" framing (parsing stage, match scoring, "thinking" animation) is entirely the deterministic formula above, not an LLM call. The "thinking" stages are cosmetic, driven by a fixed timer rather than real processing telemetry.

---

## Deployment

**Hosting config** (`render.yaml`): two Render services — a Node web service for the API (`healthCheckPath: /health`) and a static site for the client with an SPA rewrite (`/* → /index.html`). Both build commands explicitly install devDependencies (`npm install --include=dev`), which is required because `NODE_ENV=production` otherwise makes plain `npm install` skip devDependencies — and TypeScript/Vite/type packages live there.

**Required env vars**:
- Server: `MONGODB_URI`, `JWT_SECRET` (minimum length enforced), `JWT_EXPIRES_IN`, `CLIENT_URL`; optional: Cloudinary credentials (image upload), `AI_PROVIDER`/`AI_MODEL` + one matching API key (falls back to template responses if omitted)
- Client: API base URL, Cloudinary cloud name

**Seeding**: a seed script wipes and reloads the `Category`, `Product`, demo `User`, and demo `Order` collections (see Demo Accounts section above for exact contents). Server startup auto-runs this seed only when running in development mode with an empty product collection — explicitly gated off in production, so a live deploy is never auto-seeded or wiped. Running `npm run seed` manually against a live database is destructive.

**DB connection resilience**: a specific workaround exists for a known Node.js Windows DNS resolution issue affecting `mongodb+srv://` URIs — detects the failure signature and retries once with explicit DNS servers before giving up.

**Graceful shutdown**: the server handles termination signals (which Render sends on every deploy) by closing the HTTP server and disconnecting from MongoDB before exiting, so in-flight requests finish instead of being dropped mid-response.

---

## Production Readiness

**Error handling**: a centralized error-handling middleware special-cases validation errors (400 + field errors) and a custom application error type (its own status/message); anything else returns a generic message in production or the real error in development. A not-found handler returns a JSON 404 for unmatched routes.

**Security middleware present**: `helmet()`, `cors()` locked to a single configured origin, `express-rate-limit` on login/register (20 req/15min) and assistant chat (20 req/min), Zod schema validation on request bodies per route, bcrypt password hashing, JWT-based auth with server-side role checks.

**Known functional gaps** (see individual sections above for detail):
- OTP password-reset codes are only returned in the API response outside production — the on-screen reset flow does not work on the deployed URL as currently configured
- Supplier "Verified" status has no code path to become `true` except seeded data — no admin/moderation flow
- Order status transitions are restricted in the UI only, not enforced server-side
- Order-detail pages don't distinguish a real fetch error from a genuine 404 — both show "Order not found"

**What is not present** (flagged explicitly, since a judge may expect it):
- No automated tests anywhere in the repository, no test framework configured
- No CI configuration
- No structured logging, monitoring, or APM beyond HTTP request logging and console output
- No request-input sanitization layer beyond per-route schema validation
- Rate limiting is narrow — only login, register, and assistant chat are limited; the rest of the API (products, orders, etc.) has no rate limiting
