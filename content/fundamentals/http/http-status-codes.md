---
id: http-status-codes
name: HTTP Status Codes
kind: concept
status: work
tags: [http, rest, api, error-handling, express]
what: Standardized 3-digit numeric codes returned in an HTTP response to indicate whether a request succeeded, redirected, or failed.
why: Allows browsers, API clients, proxies, and caches to handle responses uniformly without parsing custom error strings in the response body.
problem: "Returning 200 OK with `{ \"success\": false, \"error\": \"...\" }` breaks HTTP caching, retry logic, API client interceptors, and monitoring alerts."
relations:
  - { to: http, label: "part of" }
  - { to: rest-api, label: "used in" }
  - { to: express, label: "returned by" }
  - { to: error-handling, label: "signals errors in" }
links:
  - { title: MDN HTTP Response Status Codes, url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status }
  - { title: RFC 9110 — Status Codes, url: https://www.rfc-editor.org/rfc/rfc9110#name-status-codes }
alsoIn: []
source: course
---

## Classes Overview (1xx–5xx)

| Class | Category | Meaning |
|---|---|---|
| **1xx** | Informational | Request headers received, continuing process (`101 Switching Protocols` for WebSockets). |
| **2xx** | Success | Request was successfully received, understood, and accepted. |
| **3xx** | Redirection | Further action needed to complete the request (URL moved or cached). |
| **4xx** | Client Error | The client sent an invalid, unauthorized, or unprocessable request. |
| **5xx** | Server Error | The client request is valid, but the server failed to fulfill it. |

## Essential Codes & Express Situations

| Code | Name | When to use in Express / REST APIs |
|---|---|---|
| **200** | `OK` | Standard success for `GET`, `PUT`, `PATCH`, or `DELETE` returning a body. |
| **201** | `Created` | Resource created (`POST /products`, `POST /signup`). Return the created item + optional `Location` header. |
| **204** | `No Content` | Action succeeded with **no response body** (`DELETE /products/:id`). Use `res.status(204).end()`. |
| **301 / 302** | `Moved Permanently` / `Found` | Server-side redirects (`res.redirect('/login')` sends `302` by default). |
| **304** | `Not Modified` | Conditional `GET` (`If-None-Match` / ETag) — tells the browser to reuse its cached copy. |
| **400** | `Bad Request` | Malformed JSON syntax, missing required query parameter, or unreadable payload. |
| **401** | `Unauthorized` | **Unauthenticated**: missing, expired, or invalid session/JWT token ("Who are you?"). |
| **403** | `Forbidden` | **Unauthorized**: user is logged in, but lacks permission/role for this resource ("I know who you are, but you can't do this"). |
| **404** | `Not Found` | Unknown route OR entity ID does not exist in DB (`Product.findByPk(id)` returned `null`). |
| **409** | `Conflict` | State conflict: e.g. registering an email that already exists, or optimistic locking mismatch. |
| **422** | `Unprocessable Content` | JSON syntax is valid, but **domain validation failed** (e.g. `express-validator`: password too short, invalid email format). |
| **429** | `Too Many Requests` | Rate limit exceeded (login brute-force protection, API throttling). |
| **500** | `Internal Server Error` | Unhandled exception, database crash, or bug in server code (caught by global error middleware). |
| **502 / 503** | `Bad Gateway` / `Service Unavailable` | Reverse proxy (Nginx/Cloudflare) cannot reach the Node process (`502`), or server is overloaded / in maintenance (`503`). |

> **Note on `505` vs `500`:** `505 HTTP Version Not Supported` means the server refuses the HTTP protocol version used in the request (extremely rare in application code). For server crashes and unhandled exceptions in Express, always use **`500 Internal Server Error`**.

## Example
```js
export async function createProduct(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 422: JSON is valid, but field validation rules failed
      return res.status(422).json({ errors: errors.array() });
    }

    const exists = await Product.findOne({ where: { sku: req.body.sku } });
    if (exists) {
      // 409: Resource state conflict (duplicate unique SKU)
      return res.status(409).json({ message: "SKU already exists" });
    }

    const product = await Product.create(req.body);
    // 201: New resource created
    return res.status(201).json(product);
  } catch (err) {
    // Forward unexpected DB/runtime failures to 500 error middleware
    next(err);
  }
}
```

## Key points
- **400 vs 422**: use `400` when the request itself is malformed (broken JSON, wrong type); use `422` when the request parses cleanly but fails business/field validation rules.
- **401 vs 403**: `401` = not logged in (re-authenticate can fix it); `403` = logged in, insufficient permissions (re-authenticating with the same account won't help).
- **Never leak stack traces on 500**: log the full error stack on the server, but return a generic message to the client in production.
