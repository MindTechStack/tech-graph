---
id: env-variables
name: "Environment Variables (dotenv)"
short: Env Variables
kind: concept
status: learned
tags: [configuration, secrets, dotenv, environment, twelve-factor]
what: "Management of runtime configuration values and sensitive credentials through operating system environment variables (process.env) and .env file loaders like dotenv."
why: "Decouples deployment configuration (database URLs, API tokens, port bindings) from application source code following 12-Factor App methodology."
problem: "Hardcoding configuration and secret credentials into source code causes accidental Git repository leaks and requires code rebuilds to change environments."
relations:
  - { to: "nodejs", label: "accessed via process.env in" }
  - { to: "express", label: "configures port and database for" }
links:
  - { title: "dotenv Documentation", url: "https://github.com/motdotla/dotenv" }
  - { title: "Node.js Environment Variables Guide", url: "https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs" }
alsoIn: []
source: course
---

## Example
```js
import "dotenv/config";

// Read and sanitize required configuration
const PORT = Number(process.env.PORT) || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("FATAL: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

export const config = {
  port: PORT,
  databaseUrl: DATABASE_URL,
  isProduction: process.env.NODE_ENV === "production",
};
```

## Key points
- **Git ignore secrets**: never commit `.env` files containing production credentials to version control; maintain a `.env.example` file documenting required variable names.
- **Fail fast on boot**: validate and parse `process.env` immediately at startup (using Zod or custom assertions) so missing configuration crashes before accepting traffic.
- **Precedence hierarchy**: OS environment variables injected by container orchestrators or cloud hosts take precedence over local values defined in `.env` files.
- **Today**: Node.js 20.6+ natively supports loading environment files via the command line flag `node --env-file=.env`, removing the necessity of the `dotenv` package for standard workflows.
