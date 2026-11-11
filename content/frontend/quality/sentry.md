---
id: sentry
name: "Sentry"
kind: service
status: work
tags: [error-tracking, crash-reporting, telemetry, observability, stack-traces]
what: "Application monitoring and error tracking service that provides real-time crash reports, stack traces, and performance telemetry."
why: "Notifies engineering teams instantly when client-side exceptions or unhandled rejections occur in production with user context and source-mapped stack traces."
problem: "Without centralized error monitoring, frontend crashes remain invisible until angry users submit customer support tickets or abandon the app."
relations:
  - { to: browser-apis, label: "captures errors in" }
  - { to: vite, label: "uploads sourcemaps from" }
links:
  - { title: "Sentry Documentation", url: "https://docs.sentry.io/" }
alsoIn: [backend]
source: work
---

## Example
```ts
// src/sentry.ts - Sentry client initialization with performance tracing
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.MODE,
});

export function logHandledException(error: unknown, context: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context });
}
```

## Key points
- **Source map demangling**: integrates with build tools to upload minified source maps, converting unreadable production stack traces back to original TypeScript lines.
- **Session Replay**: reconstructs a video-like reproduction of user clicks, mouse movements, and network latency leading up to a crash.
- **Cross-platform ubiquity**: unified platform monitors browser errors, React component boundaries, and backend Node.js services (`alsoIn: [backend]`).
