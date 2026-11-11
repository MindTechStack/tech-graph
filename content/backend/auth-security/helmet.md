---
id: helmet
name: "Helmet"
kind: library
status: learned
tags: [helmet, security, express, http-headers, csp, hsts]
what: "Security middleware package for Express and Node.js that sets essential HTTP response headers to harden web applications against known attack vectors."
why: "Prevents common browser exploits such as Cross-Site Scripting (XSS), clickjacking, MIME sniffing, and protocol downgrade attacks with minimal configuration."
problem: "Default Express headers expose backend stack details (X-Powered-By) and leave browsers vulnerable to iframe embedding, unsafe script execution, and unencrypted connections."
relations:
  - { to: express, label: "middleware for" }
  - { to: csrf, label: "complements" }
  - { to: middleware, label: "implemented as" }
links:
  - { title: "Helmet Documentation", url: "https://helmetjs.github.io/" }
  - { title: "OWASP Secure Headers Project", url: "https://owasp.org/www-project-secure-headers/" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import helmet from "helmet";

const app = express();

// Enable Helmet's 15 default security headers with customized CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "https://api.example.com"],
      },
    },
    crossOriginEmbedderPolicy: false, // Set false if embedding third-party cross-origin media
  }),
);

app.get("/", (req, res) => {
  res.send("<h1>Secure Server Response</h1>");
});
```

## Key points
- **Collection of 15 Sub-Middlewares**: Automatically configures headers including `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), `X-Frame-Options` (DENY/SAMEORIGIN), and `X-Content-Type-Options` (nosniff).
- **Hiding Server Footprints**: Strips the default `X-Powered-By: Express` header, denying automated scanners an easy way to pinpoint targeted framework vulnerabilities.
- **Content Security Policy (CSP)**: The most impactful header; strictly controls which origins can execute scripts, load stylesheets, or open WebSocket connections, drastically neutralizing XSS payloads.
- **Production SSL & HSTS**: Enforces `Strict-Transport-Security` to tell browsers to never connect over insecure plain HTTP for the specified duration (`maxAge`).
