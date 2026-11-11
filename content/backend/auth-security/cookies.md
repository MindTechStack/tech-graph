---
id: cookies
name: "Cookies"
kind: concept
status: learned
tags: [cookies, http, security, headers, state-management]
what: "Small key-value data headers sent via HTTP Set-Cookie by servers and stored by web browsers to persist state across stateless HTTP requests."
why: "Enables persistent user sessions, authentication identifiers, and user preferences on top of the inherently stateless HTTP protocol."
problem: "HTTP is entirely stateless; without cookies or alternative client storage headers, every request requires re-submitting user credentials from scratch."
relations:
  - { to: sessions, label: "carries session id for" }
  - { to: csrf, label: "vulnerable to csrf without protection" }
  - { to: jwt, label: "securely stores" }
  - { to: express, label: "parsed in" }
links:
  - { title: "MDN Using HTTP Cookies", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" }
  - { title: "RFC 6265 HTTP State Management", url: "https://datatracker.ietf.org/doc/html/rfc6265" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

// Setting a hardened HTTP-only cookie
app.post("/login", (req, res) => {
  res.cookie("sessionId", "abc-123-signed-id", {
    httpOnly: true, // Prevents client-side JavaScript access (XSS mitigation)
    secure: process.env.NODE_ENV === "production", // Transmit only over HTTPS
    sameSite: "lax", // Protects against cross-site request forgery (CSRF)
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    signed: true,
  });
  res.send({ success: true });
});

// Reading signed cookie on subsequent requests
app.get("/profile", (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    return res.status(401).send("Unauthorized");
  }
  res.send({ status: "authenticated", sessionId });
});
```

## Key points
- **Security Flags (`HttpOnly` & `Secure`)**: `HttpOnly` prevents client-side scripts from reading the cookie (protecting session tokens from XSS theft), while `Secure` forces transmission over encrypted HTTPS channels only.
- **The `SameSite` Attribute**: `SameSite=Lax` or `Strict` instructs browsers not to send cookies with cross-site requests, providing essential first-line defense against CSRF attacks.
- **Size & Scope Constraints**: Browsers restrict cookies to ~4KB per cookie and enforce strict `Domain` and `Path` boundaries to isolate data between subdomains and routes.
