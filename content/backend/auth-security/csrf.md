---
id: csrf
name: "CSRF protection"
kind: concept
status: learned
tags: [csrf, security, express, cookies, tokens, csurf]
what: "Security defense that protects web applications from Cross-Site Request Forgery attacks, where unauthorized commands are submitted from an authenticated browser."
why: "Ensures state-changing requests (POST, PUT, DELETE) originate deliberately from your application's user interface rather than a malicious third-party site."
problem: "Browsers automatically attach cookies to cross-origin requests, allowing malicious websites to silently submit unauthorized actions (e.g. money transfers, password resets) on behalf of authenticated users."
relations:
  - { to: sessions, label: "protects stateful" }
  - { to: cookies, label: "defends against cross-site" }
  - { to: express, label: "middleware integrated with" }
  - { to: helmet, label: "pairs with for app security" }
links:
  - { title: "OWASP CSRF Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" }
  - { title: "csrf-csrf GitHub Documentation", url: "https://github.com/PsycByte/csrf-csrf" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";

const app = express();
app.use(cookieParser("my-secret-key"));

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => "my-secret-key",
  cookieName: "x-csrf-token",
  cookieOptions: { sameSite: "lax", secure: process.env.NODE_ENV === "production" },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

// Provide token to the frontend (SSR template or API response)
app.get("/api/csrf-token", (req, res) => {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
});

// Protect state-changing mutating routes
app.post("/transfer", doubleCsrfProtection, (req, res) => {
  res.send({ status: "transfer processed securely" });
});
```

## Key points
- **Synchronizer & Double-Submit Token Pattern**: A secret token is tied to the user's session or cryptographically signed in a cookie; the frontend must submit this token in a header (`X-CSRF-Token`) or hidden form input (`_csrf`) on every non-safe request.
- **Safe vs Mutating HTTP Methods**: Safe methods (`GET`, `HEAD`, `OPTIONS`) must never mutate server state; CSRF validation is strictly enforced on mutating methods (`POST`, `PUT`, `PATCH`, `DELETE`).
- **Defense in Depth**: Robust defense pairs cryptographic CSRF tokens with modern browser protections: `SameSite=Lax` or `Strict` cookies, `Sec-Fetch-*` metadata headers, and `Origin` verification.
- **Today**: The classic `csurf` middleware taught in older courses has been deprecated and abandoned; modern Node.js applications use `csrf-csrf` or `csrf-sync` combined with modern browser defaults (`SameSite=Lax/Strict` cookies) and framework-level protections (Next.js Server Actions, Nuxt, SvelteKit).
