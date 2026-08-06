# Veyra — Judge Demo Walkthrough (5–7 minutes)

Optimized for a hackathon judge with 10–15 minutes total to evaluate this
submission against many others. Goal: prove premium UI, end-to-end working
flows, and meaningful (not decorative) AI — fast, with no dead air.

Two browser windows side by side (or two tabs) saves time: one logged in as
a buyer, one as a supplier, so you never wait on a logout/login round trip.

---

## 0. Before you start (30 seconds, off-camera)

- Have two accounts ready: one buyer, one supplier (register fresh or use
  seeded demo accounts if provided).
- Make sure the catalog is seeded (`npm run seed` in `server/`) so the
  marketplace isn't empty.

---

## 1. First impression — Landing page (45 sec)

Open `/`. Let it sit for a second before talking — the whitespace,
typography and motion should speak for themselves.

**Say:** "Veyra is a B2B textile marketplace — think Stripe or Linear's
design language applied to fabric sourcing, not another admin-panel
e-commerce template."

Scroll once, slowly, through hero → trusted-by stats → featured
fabrics → the AI preview card. Point at the AI preview card specifically:

**Say:** "This card is a live preview, not a mockup — clicking 'Try it
live' opens the real assistant." *(Optional: click it briefly to show the
panel opens, then close it — save the full AI demo for step 5.)*

---

## 2. Marketplace — search, filter, discovery (60 sec)

Navigate to `/marketplace`.

- Type a search term (e.g. "cotton") — point out the skeleton loading
  state appears instantly, then real results.
- Open filters, set a price range and MOQ — **say:** "Filter state lives in
  the URL, so this view is shareable and bookmarkable, not just client
  state."
- Scroll to trigger infinite scroll.

**Say:** "Every product here is a real MongoDB document — full-text search,
indexed filters, no mock data anywhere in this app."

---

## 3. Product Details + AI Insight (45 sec)

Click into any product.

- Point out the gallery, specs table, supplier card, similar products.
- Point at the "AI Fabric Insights" card — **say:** "This is computed from
  the product's actual weight, composition and MOQ, grounding it in real
  data before any AI is involved." Click "Ask a follow-up" — this opens the
  live assistant pre-loaded with this exact product as context (segue into
  step 5, or continue the buyer flow first and come back).

---

## 4. Buyer flow — cart → checkout → order (60 sec)

- Add the product to cart, adjust quantity (note it respects MOQ).
- Go to `/cart`, then checkout — fill the shipping form, place the order.
- Land on `/dashboard/orders` — **say:** "This order was just created
  against a real Order collection, priced server-side from the current
  product price — not trusted from the client, which matters once you have
  real money moving through a marketplace."

---

## 5. AI Marketplace Assistant — the centerpiece (2 min)

This is the highest-signal part of the demo. Open the assistant (floating
button, bottom-right, or the follow-up link from step 3).

Run 2–3 of these live, reading each answer out loud briefly:

1. **Natural language search with constraints:**
   "Find breathable cotton fabrics under ₹300 with MOQ below 100 meters"
   — **say:** "That's not a keyword match — it parsed a category, a price
   ceiling and an MOQ ceiling out of plain English, then ran a real MongoDB
   query before any generation happened."
2. **Comparison:** "Compare these two fabrics" (works especially well from
   a product page, or ask it to compare two named fabrics).
3. **Explanation:** "Explain why this is suitable for sportswear."
4. **Guidance:** "Help me choose fabric for oversized t-shirts."

Point out while it's streaming:

**Say:** "Responses stream in — and every answer cites its sources: these
are real product cards, clickable, linking straight back into the
marketplace. The AI never leaves the marketplace experience; it's a layer
on top of it, not a separate product."

**Say (architecture, one sentence):** "It's provider-agnostic — same
frontend works whether it's calling OpenAI, Groq, Gemini, Hugging Face, or
running on a zero-config deterministic fallback with no API key at all,
which is what's running right now."

---

## 6. Supplier flow (60 sec)

Switch to the supplier window/tab.

- `/supplier/dashboard` — stats, recent orders, inventory alerts.
- `/supplier/inventory` — show the product list, open one listing to edit,
  point at image upload.
- `/supplier/orders` — find the order placed in step 4, walk its status
  forward one step. **Say:** "That status change is visible on the buyer's
  side instantly — same order document, no sync delay."

---

## 7. Close (30 sec)

**Say:** "End to end: a buyer and a supplier can both onboard, transact,
and fulfill an order today, with an AI assistant that's grounded in real
marketplace data at every step rather than a bolted-on chatbot. Clean
provider-agnostic architecture on the AI layer, real MongoDB-backed
everything else, and it's already hardened for deployment — rate limiting,
server-side price validation, gzip, graceful shutdown, health checks."

---

## If a judge interrupts to ask "what's not done"

Be direct, don't dodge: cart is client-only (not synced across devices),
no payment collection (out of scope for this MVP), no supplier messaging
yet. All three are documented, deliberate scope decisions, not oversights —
see `TASKS.md`'s "Known gaps" section.

## If something breaks live

Have `npm run dev` running in both `client/` and `server/` as a fallback if
the Render free-tier deploy is cold-starting. Free Render web services
sleep after inactivity — hit `/health` a minute before the demo starts to
warm it up.
