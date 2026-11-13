---
id: cloudflare
name: "Cloudflare (Workers / Pages)"
kind: platform
status: planned
tags: [cloudflare, edge, serverless, cdn, workers, pages]
what: "Network and hosting platform: DNS, DDoS protection, Workers (V8 isolates at the edge) and Pages for static and full-stack sites."
why: "Runs compute logic within milliseconds of end users across hundreds of edge data centers without cold starts, while offering generous free-tier hosting and edge KV/D1."
problem: "Traditional regional cloud servers experience high latency for users across different continents and suffer from noticeable serverless container cold starts."
relations:
  - { to: astro, label: "deploys to" }
  - { to: hono, label: "runs on" }
  - { to: ssl-tls, label: "uses" }
links:
  - { title: "Cloudflare Workers Docs", url: "https://developers.cloudflare.com/workers/" }
  - { title: "Cloudflare Pages Docs", url: "https://developers.cloudflare.com/pages/" }
alsoIn: []
source: self-study
---

## Example
```jsonc
// wrangler.jsonc - Cloudflare Workers & Pages configuration
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-edge-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-11-01",
  "compatibility_flags": ["nodejs_compat"],
  "kv_namespaces": [
    {
      "binding": "CACHE_KV",
      "id": "a8f3b...91c"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "prod-db",
      "database_id": "c192d...44e"
    }
  ]
}
```

```ts
// src/index.ts - Edge worker handler using Web Standards API
export interface Env {
  CACHE_KV: KVNamespace;
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/fast-ping") {
      return new Response(JSON.stringify({ status: "ok", edge: "anycast" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const cached = await env.CACHE_KV.get(url.pathname);
    if (cached) {
      return new Response(cached, { headers: { "X-Cache": "HIT" } });
    }

    return new Response("Not found", { status: 404 });
  },
};
```

## Key points
- **V8 isolates instead of containers**: Cloudflare Workers start in under 5 milliseconds (virtually 0ms cold starts) by running in shared V8 engine isolates rather than bootable Docker containers.
- **Global Anycast network**: requests are automatically routed to the geographically closest edge location among 300+ worldwide data centers.
- **Edge storage primitives**: built-in serverless data storage options including Workers KV (low-latency key-value), D1 (serverless relational SQLite at the edge), and R2 (S3-compatible zero-egress object storage).
