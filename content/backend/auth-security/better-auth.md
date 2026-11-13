---
id: better-auth
name: "Better Auth"
kind: library
status: practiced
tags: [better-auth, authentication, typescript, sso, oauth, session-management]
what: "Framework-agnostic TypeScript auth library that runs inside your own server and database, including edge runtimes."
why: "Provides built-in email/password, social OAuth, passkeys, multi-session management, and rate limiting with end-to-end type safety and zero vendor lock-in."
problem: "Building custom production-grade authentication from scratch requires hundreds of hours handling OAuth edge cases, CSRF, session rotation, and passkeys, while third-party SaaS auth is costly."
relations:
  - { to: cookies, label: "manages secure session" }
  - { to: drizzle, label: "persists schemas via" }
  - { to: typescript, label: "built with end-to-end" }
  - { to: rbac, label: "provides role plugins for" }
  - { to: nodejs, label: "runs on" }
links:
  - { title: "Better Auth Documentation", url: "https://www.better-auth.com/docs" }
  - { title: "Better Auth GitHub Repository", url: "https://github.com/better-auth/better-auth" }
alsoIn: []
source: personal
---

## Example
```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthClient } from "better-auth/client";
import { db } from "./db";

// 1. Server-side initialization with Drizzle ORM adapter
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});

// 2. Client-side SDK with end-to-end type safety
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Idiomatic login call from client
const { data, error } = await authClient.signIn.email({
  email: "developer@example.com",
  password: "secure-password",
});
```

## Key points
- **End-to-End Type Safety**: Automatically infers client SDK return types, user session models, and plugin methods directly from your server configuration without separate codegen steps.
- **Self-Hosted Data Ownership**: Plugs directly into your existing PostgreSQL, SQLite, or MySQL database via adapters (Drizzle, Prisma, Kysely), eliminating third-party SaaS data silos and per-user monthly bills.
- **Rich Plugin Architecture**: Extends core authentication with modular plugins for Two-Factor Authentication (TOTP), Passkeys/WebAuthn, Multi-Tenancy Organizations, and granular RBAC.
- **Universal Runtime Support**: Operates smoothly across Node.js, Next.js, Nuxt, SvelteKit, Astro, Cloudflare Workers, and Bun with native standard Web Request/Response APIs.
