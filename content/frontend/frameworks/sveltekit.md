---
id: sveltekit
name: SvelteKit
kind: framework
status: practiced
tags: [svelte, ssr, routing, form-actions, fullstack]
what: "Official full-stack application framework for Svelte featuring filesystem routing, server/universal `load` functions, progressive Form Actions, and deployment adapters."
why: "Unifies SSR, client-side navigation, type-safe data loading (`$types`), and progressive enhancement forms in a Vite-native workflow."
problem: "Wiring SSR, code splitting, CSRF-safe mutations, and serverless deployment targets manually for a Svelte app requires extensive custom infrastructure."
relations:
  - { to: svelte, label: "built on" }
  - { to: vite, label: "Vite plugin for" }
  - { to: typescript, label: "auto-generates types for" }
  - { to: nodejs, label: "runs server on" }
links:
  - { title: "SvelteKit Documentation", url: https://svelte.dev/docs/kit/introduction }
alsoIn: []
source: personal
---

## Example
```ts
// src/routes/notes/+page.server.ts
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  return {
    notes: await locals.db.getNotes(),
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();

    if (!title) {
      return fail(400, { title, missing: true });
    }

    await locals.db.insertNote({ title });
    return { success: true };
  },
};
```

## Key points
- **`+page.server.ts` vs `+page.ts`**: `+page.server.ts` runs exclusively on the server (safe for DB queries and secrets); `+page.ts` runs on the server during initial SSR and in the browser on subsequent navigations.
- **Generated `$types`**: importing `PageData`, `ActionData`, and `PageServerLoad` from `./$types` links server return values to component `$props()` with zero manual type duplication.
- **Progressive Form Actions**: `<form method="POST" use:enhance>` works without JavaScript and upgrades to smooth client-side updates when hydrated.

