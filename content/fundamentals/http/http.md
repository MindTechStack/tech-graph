---
id: http
name: "HTTP protocol"
kind: concept
status: learned
tags: [http, protocol, networking, rest, web-standards]
what: "The foundational application-layer protocol of the World Wide Web, operating over TCP/IP as a stateless request-response exchange between clients and servers."
why: "Underpins all browser-to-server and service-to-service communication, defining standardized message framing, headers, status codes, and caching semantics."
problem: "Without a standardized protocol, clients and servers would require custom binary or socket protocols for every web transaction, eliminating universal interoperability."
relations:
  - { to: http-methods, label: "uses" }
  - { to: http-status-codes, label: "uses" }
  - { to: node-http, label: "integrates with" }
  - { to: rest-api, label: "part of" }
links:
  - { title: "MDN HTTP Overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" }
  - { title: "RFC 9110 — HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110" }
alsoIn: []
source: course
---

## Example
```http
POST /api/v1/orders HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOi...
Content-Length: 48

{
  "productId": "prod_123",
  "quantity": 2
}

HTTP/1.1 201 Created
Date: Wed, 11 Nov 2026 08:30:00 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 74
Connection: keep-alive

{
  "orderId": "ord_987",
  "status": "pending",
  "createdAt": "2026-11-11T08:30:00Z"
}
```

## Key points
- **Stateless by design**: each request is independent; state across transactions is maintained via cookies, session identifiers, or bearer tokens.
- **Protocol evolution**: HTTP/1.1 uses persistent TCP connections with head-of-line blocking; HTTP/2 introduces binary multiplexing over single TCP streams; HTTP/3 runs over QUIC (UDP) for zero-RTT handshakes and connection migration.
- **Message format**: composed of a start line (method + target + version or status code), key-value header lines, a blank line (`\r\n\r\n`), and an optional body payload.
