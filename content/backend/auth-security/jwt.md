---
id: jwt
name: "JSON Web Tokens"
kind: concept
status: learned
tags: [jwt, json-web-tokens, authentication, tokens, rest-api, stateless]
what: "Compact, URL-safe standard (RFC 7519) for transmitting cryptographically signed identity claims between client and server as a JSON object."
why: "Enables stateless authentication across microservices, mobile apps, and distributed backends without querying a central session database on every request."
problem: "Stateful session databases introduce centralized query bottlenecks, cross-region network latency, and scaling friction for decoupled REST APIs and mobile clients."
relations:
  - { to: cookies, label: "can be transported via" }
  - { to: bcrypt, label: "issued after credential check with" }
  - { to: sessions, label: "stateless alternative to" }
  - { to: express, label: "verified in middleware in" }
links:
  - { title: "JWT.io Introduction and Debugger", url: "https://jwt.io/introduction" }
  - { title: "RFC 7519 JSON Web Token Specification", url: "https://datatracker.ietf.org/doc/html/rfc7519" }
alsoIn: []
source: course
---

## Example
```js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// 1. Issue token upon successful login
function generateAccessToken(userId, role) {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    { expiresIn: "15m", algorithm: "HS256" },
  );
}

// 2. Express authentication middleware verifying JWT signature and expiration
function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = userPayload; // e.g. { sub: 'user_123', role: 'admin', exp: ... }
    next();
  });
}
```

## Key points
- **Three-Part Structure**: Composed of `header.payload.signature` encoded in Base64URL. The payload is readable by anyone; never store sensitive data like plaintext passwords or unencrypted PII inside a JWT.
- **Stateless Verification**: Any service with the shared secret (HS256) or public key (RS256) can verify token authenticity and claims locally without hitting a central database.
- **Revocation & Refresh Strategy**: Because JWTs are stateless, revoking a leaked access token requires either a denylist in a fast cache (Redis) or using very short-lived access tokens (15 mins) paired with revocable database refresh tokens.
- **Storage Security**: Storing tokens in `localStorage` leaves them susceptible to XSS extraction; transporting them in `HttpOnly`, `Secure`, `SameSite=Strict` cookies offers superior defense in browser environments.
