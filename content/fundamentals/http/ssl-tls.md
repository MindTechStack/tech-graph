---
id: ssl-tls
name: "SSL/TLS & HTTPS"
kind: concept
status: work
tags: [ssl, tls, https, security, encryption, certificates]
what: "Cryptographic protocols (TLS 1.2/1.3) that secure HTTP communications over the network through asymmetric authentication, symmetric data encryption, and message integrity."
why: "Protects sensitive user data (passwords, tokens, cookies) against eavesdropping, tampering, and man-in-the-middle attacks between client and server."
problem: "Plaintext HTTP exposes all request and response payloads, credentials, and headers to anyone on the same network or route via packet sniffing and ISP injection."
relations:
  - { to: http, label: "uses" }
  - { to: helmet, label: "integrates with" }
  - { to: node-http, label: "integrates with" }
  - { to: cloudflare, label: "deploys to" }
links:
  - { title: "MDN Transport Layer Security (TLS)", url: "https://developer.mozilla.org/en-US/docs/Glossary/TLS" }
  - { title: "Let's Encrypt Documentation", url: "https://letsencrypt.org/docs/" }
alsoIn: []
source: self-study
---

## How TLS & HTTPS Work

HTTPS operates by layering the standard HTTP protocol on top of an encrypted TLS (Transport Layer Security) connection running over TCP port 443.

```
Client                                                         Server
  | ----------------- 1. ClientHello (cipher suites, SNI) ----> |
  | <---------------- 2. ServerHello, TLS Certificate --------- |
  |                   3. Verify CA signature & chain            |
  | ----------------- 4. Key Exchange (ECDHE parameters) ------> |
  |                   5. Derive shared symmetric session key    |
  | <================ 6. Encrypted HTTP Application Data =====> |
```

1. **TLS Handshake**: The client initiates contact via `ClientHello` advertising supported TLS versions and cipher suites. The server responds with `ServerHello` and its public digital certificate.
2. **Asymmetric Key Exchange**: The client verifies the certificate against built-in Root Certificate Authorities (CAs). Using elliptic-curve Diffie-Hellman (ECDHE), the client and server exchange public parameters to derive a shared secret without ever transmitting the secret over the wire.
3. **Symmetric Session Encryption**: Once the shared secret is established, all subsequent HTTP request/response payloads are encrypted using high-speed symmetric ciphers (such as AES-GCM or ChaCha20-Poly1305).
4. **Certificate Authorities & Let's Encrypt**: Trusted third-party CAs cryptographically sign public keys linked to domain names. Automated CAs like Let's Encrypt utilize the ACME protocol to issue and renew free, trusted 90-day certificates automatically via DNS or HTTP-01 challenge verification.

## TLS Termination in Production vs Local Dev

| Concern | Local Development | Production Architecture |
|---|---|---|
| **Where TLS Terminates** | Inside the Node.js application process (`https.createServer`). | At the Edge Reverse Proxy, Load Balancer, or CDN (Cloudflare, AWS ALB, Nginx). |
| **Certificate Source** | OpenSSL self-signed certificate (`openssl req -nodes -new -x509 -keyout server.key -out server.cert`) or `mkcert`. | Automated CA certificate (Let's Encrypt via certbot, AWS Certificate Manager, or Cloudflare Edge SSL). |
| **Node.js Responsibility** | Handles certificate loading, TLS handshake math, and port binding. | Runs unencrypted standard `http.createServer` listening on private VPC port (e.g., 3000) behind reverse proxy. |
| **HSTS (Strict-Transport-Security)** | Usually disabled locally to avoid caching HTTPS requirements on `localhost`. | Enforced via Helmet middleware: instructs browsers to refuse unencrypted HTTP for 1–2 years (`maxAge: 31536000, includeSubDomains: true, preload: true`). |

## Example
```ts
import fs from "node:fs";
import https from "node:https";
import express from "express";
import helmet from "helmet";

const app = express();

// Enforce HTTP Strict Transport Security (HSTS) and security headers
app.use(
  helmet({
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ secure: req.secure, protocol: req.protocol });
});

// In Production: TLS is terminated by Cloudflare/Nginx; Node listens on HTTP
if (process.env.NODE_ENV === "production") {
  app.listen(3000, () => {
    console.log("Production server listening on HTTP port 3000 behind TLS reverse proxy");
  });
} else {
  // In Local Development: Node can load self-signed OpenSSL certificates directly
  const sslOptions = {
    key: fs.readFileSync("./certs/server.key"),
    cert: fs.readFileSync("./certs/server.cert"),
  };

  https.createServer(sslOptions, app).listen(3443, () => {
    console.log("Local HTTPS server running on https://localhost:3443");
  });
}
```

## Key points
- **Asymmetric for handshake, symmetric for bulk data**: asymmetric cryptography (RSA/ECC) verifies identity and exchanges secrets; symmetric cryptography (AES-GCM) encrypts actual traffic efficiently.
- **Terminate TLS at the edge**: do not burden Node.js event loops with TLS CPU termination in production; offload decryption to reverse proxies or edge CDNs (Cloudflare, Nginx, ALB).
- **HSTS prevents downgrade attacks**: Helmet's `Strict-Transport-Security` header forces browsers to rewrite any `http://` link to `https://` before sending packets, eliminating SSL-stripping MITM exploits.
