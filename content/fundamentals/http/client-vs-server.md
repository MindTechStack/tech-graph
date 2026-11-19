---
id: client-vs-server
name: "Client vs Server code"
kind: concept
status: work
tags: [architecture, client-server, astro, security, rendering, ssr]
what: "The architectural boundary separating code running securely in the Node.js/server runtime from code executing publicly in the client's web browser environment."
why: "Prevents secret leakage, protects database credentials, guarantees authoritative business rule execution, and optimizes bundle size by offloading logic to the server."
problem: "Placing database credentials, payment calculation logic, or authorization checks in client-side code allows users to inspect secrets and bypass security via DevTools."
relations:
  - { to: astro, label: "implements" }
  - { to: rendering-strategies, label: "uses" }
  - { to: nodejs, label: "runs on" }
  - { to: browser-apis, label: "integrates with" }
  - { to: rbac, label: "protects against" }
links:
  - { title: "Astro Islands & Architecture", url: "https://docs.astro.build/en/concepts/islands/" }
  - { title: "OWASP Client-Side Security", url: "https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html" }
alsoIn: []
source: self-study
---

## Server-Only vs Client-Side Responsibilities

| Responsibility Area | Server-Side Only (Node.js / Edge) | Client-Side (Browser / DOM) |
|---|---|---|
| **Secrets & Keys** | Private API keys (`STRIPE_SECRET_KEY`, database passwords, private encryption keys). Kept out of JavaScript bundles. | Only public tokens (`STRIPE_PUBLISHABLE_KEY`, public Sentry DSN). Visible in page source and DevTools. |
| **Database Access** | Direct queries (`SELECT * FROM users`, ORM calls via Sequelize/Drizzle, connection pools). | Never direct DB connections. Interacts via authenticated HTTP/REST/GraphQL APIs. |
| **Authorization & RBAC** | Authoritative gatekeeper. Enforces role and permission checks before mutating state or returning data. | Cosmetic/UX only (hiding admin buttons, route guards). Trivial for users to bypass via console. |
| **Validation** | Authoritative business validation (`zod`, `express-validator`). Sanitizes input and protects database integrity. | Immediate UX feedback (instant form errors, regex format checking) before network transmission. |
| **Pricing & Payments** | Authoritative calculation of cart totals, discounts, taxes, and shipping rates on the server. | Form displays, optimistic UI updates, and collecting payment token via iframe/SDK. |
| **State & Interactivity** | Session store access, rendering initial static HTML, processing webhooks. | Ephemeral UI state (modals open/closed, tabs, hover tooltips, animation triggers). |
| **DOM & Browser APIs** | No `window`, `document`, `navigator`, or `localStorage` (throws `ReferenceError` during SSR). | Full DOM event listeners (`click`, `scroll`, `keypress`), `localStorage`, `IndexedDB`, Geolocation. |

## How Astro Splits Client and Server

Astro is engineered from the ground up to maintain a strict, zero-JavaScript-by-default boundary between server execution and client interactivity:

1. **Frontmatter Component Script (`---`)**:
   Code inside the frontmatter code fence executes **strictly at build time (SSG) or on request (SSR)** in Node.js/Edge runtimes. You can safely import server-only packages, connect directly to databases, and read private environment variables (`import.meta.env.SECRET_KEY`). Nothing inside the frontmatter is sent to the client bundle.
2. **Static HTML by Default**:
   Astro components render directly to static HTML and CSS. Even if you use React, Vue, or Svelte components inside an Astro template, Astro strips their JavaScript client runtime and outputs pure HTML by default.
3. **Islands Architecture (`client:*` Directives)**:
   Client-side JavaScript is opt-in per component using explicit hydration directives:
   - `client:load`: Hydrates the interactive UI component immediately on initial page load (for critical navigation, search bars).
   - `client:idle`: Hydrates after the main thread is idle (lower priority interactive elements).
   - `client:visible`: Hydrates only when the component enters the user's viewport via `IntersectionObserver` (heavy interactive carousels or comments).
   - `client:only="react"`: Skips server-side rendering entirely and renders exclusively on the client (components depending strictly on browser-only canvas or WebGL APIs).
4. **Server Endpoints & Astro Actions**:
   - `src/pages/api/data.ts` exports standard `GET`, `POST`, `DELETE` handlers running server-side returning `Response` objects.
   - **Astro Actions**: Type-safe server RPC functions defined in `src/actions/index.ts` with Zod validation, called directly from client components without writing manual fetch boilerplate.
5. **SSR vs SSG**:
   Astro defaults to static site generation (`output: 'static'`). Adding `export const prerender = false;` or switching to `output: 'server'` enables on-demand per-request server rendering with access to request cookies and headers.

## Example
```astro
---
// SERVER-SIDE ONLY: Runs at build/request time in Node.js
// Private secrets, direct DB queries, and server packages never reach the browser bundle
import { db } from "../lib/db";
import CartButton from "../components/CartButton.vue";
import ProductReviews from "../components/ProductReviews.tsx";

const { id } = Astro.params;
const product = await db.query.products.findFirst({
  where: (p, { eq }) => eq(p.id, id),
});

if (!product) {
  return Astro.redirect("/404");
}
---

<!-- Pure Static HTML: Zero client JavaScript shipped for this shell -->
<article class="product-page">
  <h1>{product.name}</h1>
  <p class="price">${product.price.toFixed(2)}</p>
  <div class="description">{product.description}</div>

  <!-- Interactive Island 1: Hydrated immediately for instant checkout interaction -->
  <CartButton client:load productId={product.id} price={product.price} />

  <!-- Interactive Island 2: Hydrated only when scrolled into view -->
  <ProductReviews client:visible productId={product.id} />
</article>
```

## Key points
- **Zero JS by default**: Astro renders templates to pure HTML on the server; client JavaScript is opted into on an island-by-island basis.
- **Never trust client state**: authorization and prices must be validated on the server on every mutating request regardless of client-side checks.
- **SSR window guards**: server-side code does not have access to `window` or `document`; browser-only code must be isolated behind `client:only` or lifecycle hooks (`onMounted` / `useEffect`).
