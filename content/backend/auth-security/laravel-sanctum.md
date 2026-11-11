---
id: laravel-sanctum
name: "Laravel Sanctum"
kind: service
status: work
tags: [laravel-sanctum, authentication, api-tokens, cookies, spa, laravel]
what: "Featherweight authentication system for Laravel providing cookie-based session auth for SPAs and hashed personal API tokens for mobile or external clients."
why: "Solves full-stack authentication without the complexity of a full OAuth2 server, delivering seamless CSRF-protected cookie sessions alongside scoped API tokens."
problem: "Setting up a heavy OAuth2 server (like Laravel Passport) introduces massive architectural complexity for simple SPA projects, while naive stateless tokens risk XSS exposure."
relations:
  - { to: cookies, label: "uses stateful session" }
  - { to: csrf, label: "requires CSRF cookie for SPA" }
  - { to: rbac, label: "supports token abilities for" }
  - { to: sessions, label: "hybrid session and token model" }
links:
  - { title: "Laravel Sanctum Documentation", url: "https://laravel.com/docs/master/sanctum" }
  - { title: "Laravel SPA Authentication Guide", url: "https://laravel.com/docs/master/sanctum#spa-authentication" }
alsoIn: [frontend]
source: work
---

## Example
```ts
// 1. Frontend SPA (Vue / React / Axios) authentication flow
import axios from "axios";

axios.defaults.withCredentials = true; // Crucial for receiving and sending session cookies
axios.defaults.baseURL = "https://api.example.com";

// First, fetch the CSRF cookie from Laravel Sanctum
await axios.get("/sanctum/csrf-cookie");

// Now send login credentials; Sanctum sets an encrypted, HttpOnly session cookie
await axios.post("/login", {
  email: "user@example.com",
  password: "password123",
});

// Subsequent requests automatically include the session cookie and XSRF-TOKEN header
const { data: user } = await axios.get("/api/user");
console.log("Logged in user:", user);
```

```php
// 2. Backend Laravel token creation with granular abilities (for mobile / CLI)
// In UserController.php:
$token = $user->createToken('mobile-app', ['orders:create', 'orders:read']);

return response()->json(['token' => $token->plainTextToken]);

// In Route / Controller:
if ($request->user()->tokenCan('orders:create')) {
    // Authorized to create orders
}
```

## Key points
- **Cookie Session for SPAs vs API Tokens**: First-party single-page applications share domain cookies with Laravel's built-in session guard, avoiding insecure token storage in `localStorage`. Mobile and third-party integrations use hashed Bearer tokens.
- **CSRF Protection Handshake**: The SPA initializes authentication by querying `/sanctum/csrf-cookie`, which returns an encrypted `XSRF-TOKEN` cookie; Axios reads this cookie and passes it back in the `X-XSRF-TOKEN` request header.
- **Token Abilities & Scopes**: Personal access tokens can be restricted with specific abilities (`tokenCan('reports:export')`), enabling fine-grained API authorization without complex OAuth2 scopes.
- **Revocation & Expiration**: Sanctum tokens are stored as SHA-256 hashes in the `personal_access_tokens` table, allowing users to inspect active devices, check last-used timestamps, and revoke specific tokens on demand.
