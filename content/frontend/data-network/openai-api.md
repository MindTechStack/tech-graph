---
id: openai-api
name: OpenAI API
kind: service
status: work
tags: [ai, llm, streaming, rest-api, openai]
what: "RESTful and streaming API service providing access to OpenAI generative language, vision, and reasoning models."
why: "Enables integration of AI text completion, function calling, chat conversations, and semantic embeddings into frontend workflows."
problem: "Building and hosting proprietary large language models locally is computationally prohibitive and architecturally complex for web applications."
relations:
  - { to: fetch-api, label: "streams responses via" }
  - { to: typescript, label: "typed with official sdk in" }
  - { to: api-error-layer, label: "proxied through" }
links:
  - { title: "OpenAI API Reference", url: https://platform.openai.com/docs/api-reference }
alsoIn: []
source: work
---

## Example
```ts
export async function* streamChatCompletion(
  prompt: string,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const response = await fetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Stream error: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ") || trimmed === "data: [DONE]") continue;

      const json = JSON.parse(trimmed.slice(6));
      const delta = json.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
```

## Key points
- **API key security**: Never expose raw OpenAI API keys in client-side frontend code; always proxy requests through a backend endpoint or serverless function.
- **Server-Sent Events streaming**: Utilize streaming (`stream: true`) to display tokens incrementally as they generate, reducing perceived latency for user queries.
- **Structured outputs & tool calling**: Constrain model responses with JSON schema definitions or tool call definitions to reliably parse machine-readable UI payloads.
