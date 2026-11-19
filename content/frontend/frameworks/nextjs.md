---
id: nextjs
name: Next.js
kind: framework
status: practiced
tags: [react, ssr, rsc, app-router, fullstack]
what: "Production React meta-framework providing file-system routing, React Server Components (RSC), streaming SSR, static generation, and server actions."
why: "Moves data fetching and heavy dependencies to the server by default while seamlessly interleaving interactive client components."
problem: "Pure client-side React apps ship large JavaScript bundles, suffer from client-side fetch waterfalls, and expose poor initial HTML to search engines."
relations:
  - { to: react, label: "built on" }
  - { to: typescript, label: "typed with" }
  - { to: nodejs, label: "runs server on" }
  - { to: nuxt, label: "React counterpart to" }
links:
  - { title: "Next.js Documentation", url: https://nextjs.org/docs }
alsoIn: []
source: self-study
---

## Example
```tsx
// app/nodes/[id]/page.tsx — React Server Component (zero client JS by default)
import { notFound } from "next/navigation";
import { BookmarkButton } from "./BookmarkButton";

interface PageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function NodePage({ params }: PageProps) {
  const { id } = await params;
  const res = await fetch(`https://api.example.com/nodes/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) notFound();
  const node: { id: string; name: string; summary: string } = await res.json();

  return (
    <main>
      <h1>{node.name}</h1>
      <p>{node.summary}</p>
      <BookmarkButton nodeId={node.id} />
    </main>
  );
}
```

## Key points
- **Server Components vs Client Components**: components in the App Router are Server Components by default (`async` functions that can query databases directly); add `"use client"` at the top of leaf files that need `useState`, `useEffect`, or browser event handlers.
- **Serialization boundary**: props passed from a Server Component to a `"use client"` component must be JSON-serializable (no functions or class instances, except Server Actions).
- **Caching & revalidation**: combine static rendering with time-based ISR (`revalidate: 60`) or on-demand `revalidateTag()` / `revalidatePath()` after mutations.

