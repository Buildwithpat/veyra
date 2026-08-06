# Veyra — Production Deployment Checklist

Concise, ordered checklist for taking Veyra from this repo to a live Render
deployment. See `render.yaml` for the service definitions this checklist
walks through.

## 1. Provision infrastructure

- [ ] Create a MongoDB Atlas cluster (free M0 tier is enough for a demo).
      Whitelist `0.0.0.0/0` (Render's egress IPs aren't static) or use
      Atlas's Render-specific network peering if you need tighter access.
- [ ] Create a Cloudinary account (free tier). Grab cloud name, API key,
      API secret from the dashboard.
- [ ] (Optional) Create an API key with one AI provider — Groq is the
      fastest/cheapest to verify: https://console.groq.com. OpenAI, Hugging
      Face, and Gemini are also supported (`AI_PROVIDER` env var). **Skip
      this step entirely and the assistant still works** — it runs on a
      deterministic template fallback with zero external calls when no
      provider is configured.

## 2. Deploy via `render.yaml`

- [ ] Push this repo to GitHub/GitLab, connect it in the Render dashboard as
      a Blueprint (`render.yaml` is already at the repo root — Render
      detects it automatically).
- [ ] Render will create two services: `veyra-api` (Node web service) and
      `veyra-client` (static site). Fill in the `sync: false` env vars in
      the dashboard for `veyra-api`:
  - `MONGODB_URI` — your Atlas connection string
  - `JWT_SECRET` — a random 32+ character string (`openssl rand -hex 32`)
  - `CLIENT_URL` — the `veyra-client` static site's Render URL (needed for
    CORS — set this *after* the client service's URL is known)
  - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
  - `AI_PROVIDER` / `AI_MODEL` / the matching API key — only if you did
    step 1's optional AI provider setup, otherwise leave blank
- [ ] Fill in `VITE_API_URL` for `veyra-client` — the `veyra-api` service's
      Render URL with `/api` appended (e.g.
      `https://veyra-api.onrender.com/api`).
- [ ] Trigger a deploy. `veyra-api`'s health check is `/health` — Render
      will wait for a 200 before marking the deploy live.

## 3. Seed the database

- [ ] From your local machine (with `MONGODB_URI` pointed at the same Atlas
      cluster in `server/.env`), run `cd server && npm run seed`. This
      loads the demo catalog: 28 products, 8 categories, 7 suppliers.

## 4. Verify end-to-end against the live deployment

This is the one verification step that could not be run in the sandbox this
project was built in (no live database or LLM credentials were available
there) — do this before considering the deploy final:

- [ ] Register a buyer account, complete onboarding, browse the
      marketplace, add to cart, check out, confirm the order appears in
      "My Orders."
- [ ] Register a supplier account, complete onboarding, create a product
      listing with an uploaded image, confirm it appears on the public
      marketplace.
- [ ] Place an order against that supplier's product from the buyer
      account, confirm it appears in the supplier's "Incoming Orders," walk
      the status forward, confirm the buyer sees the update.
- [ ] Open the AI assistant (floating button, bottom-right) and run through
      the five example queries from the product spec:
  1. "Find breathable cotton fabrics under ₹300 with MOQ below 100 meters"
  2. "Compare these two fabrics" (from a product page)
  3. "Recommend alternatives"
  4. "Explain why this fabric is suitable for sportswear"
  5. "Help me choose fabric for oversized t-shirts"
- [ ] If an `AI_PROVIDER` was configured, confirm responses stream
      token-by-token from the real model, not the template fallback.

## 5. Final checks

- [ ] `curl https://<veyra-api-url>/health` returns `{"success":true,...}`.
- [ ] Client loads with no console errors, no broken images, correct title
      per route (browser tab).
- [ ] Confirm rate limiting doesn't block normal usage: 20 requests/15min
      on login/register, 20 requests/min on the AI assistant — generous for
      a real user, tight enough to block abuse.
- [ ] Do a full reload on a deep route (e.g. `/marketplace`) to confirm the
      SPA rewrite rule in `render.yaml` is working (no 404).

## Known limitations to disclose, not hide

- Cart is client-only (localStorage), not synced across devices.
- No payment collection — checkout creates an order record, no payment
  gateway integration (explicitly out of scope for this MVP).
- No supplier messaging/sample-request flow yet.
- Free-tier Render web services spin down after inactivity — the first
  request after idle will be slow (cold start). Fine for a demo, worth a
  paid tier for anything beyond that.
