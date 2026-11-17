---
id: mcp
name: "MCP (Model Context Protocol)"
short: MCP
kind: concept
status: work
tags: [ai, mcp, protocol, tools, json-rpc, agents]
what: "Open protocol for connecting AI apps to external tools, data and prompts through MCP servers."
why: "A tool written once as an MCP server works in every MCP-capable client (Claude Code, Antigravity, Codex, and others) without a separate integration for each."
problem: "Without a shared protocol, every AI client needs its own plugin format and glue code for each database, API, or service, so integrations don't carry over between tools."
relations: []
links:
  - { title: "MCP Specification & Docs", url: "https://modelcontextprotocol.io/" }
  - { title: "MCP TypeScript SDK", url: "https://github.com/modelcontextprotocol/typescript-sdk" }
alsoIn: []
source: work
---

## Example
```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "orders", version: "1.0.0" });

// A tool the agent can discover and call with validated arguments
server.registerTool(
  "get_order_status",
  {
    description: "Look up the current status of an order by its id",
    inputSchema: { orderId: z.string() },
  },
  async ({ orderId }) => ({
    content: [{ type: "text", text: `Order ${orderId}: shipped` }],
  }),
);

await server.connect(new StdioServerTransport());
```

## Key points
- **Host / client / server**: the AI app (host) opens one client connection per MCP server; servers expose **tools** (actions), **resources** (readable data), and **prompts** (templates).
- **Transports**: `stdio` for local servers started as a child process, Streamable HTTP for remote servers; messages are JSON-RPC 2.0.
- **Security pitfall**: tool descriptions and results go straight into the model's context, so an untrusted server can inject instructions; install only servers you trust and keep write-capable tools behind approval.

