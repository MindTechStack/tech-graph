---
id: astro
name: Astro
kind: framework
status: practiced
tags: [islands, ssg, ssr, content-collections, zero-js]
what: "Content-focused web framework that renders HTML on the server and ships no client JavaScript by default, hydrating only the interactive islands."
why: "Delivers top Lighthouse scores for blogs, docs, and marketing sites while letting you mix React, Vue, and Svelte islands on the same page."
problem: "Using a full SPA framework for content-heavy sites forces users to download and hydrate hundreds of kilobytes of JavaScript just to read static text."
relations:
  - { to: vite, label: "built on" }
  - { to: rendering-strategies, label: "implements Islands in" }
  - { to: client-vs-server, label: "enforces boundary of" }
  - { to: react, label: "mounts islands of" }
  - { to: vue, label: "mounts islands of" }
  - { to: svelte, label: "mounts islands of" }
links:
  - { title: "Astro Documentation", url: https://docs.astro.build/ }
  - { title: "Astro Islands Architecture", url: https://docs.astro.build/en/concepts/islands/ }
alsoIn: []
source: self-study
---

## Example
```astro
---
// src/pages/blog/[slug].astro
import { getCollection, render } from "astro:content";
import InteractiveSearch from "../../components/InteractiveSearch.tsx";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <!-- Hydrates only when scrolled into view -->
  <InteractiveSearch client:visible />
  <Content />
</article>
```

## Key points
- **Explicit client directives**: framework components render as static HTML unless annotated with `client:load`, `client:idle`, `client:visible`, or `client:only`.
- **Content Collections**: `src/content.config.ts` validates Markdown/MDX/YAML frontmatter at build time using Zod schemas and generates type-safe queries via `getCollection()`.
- **Server Islands (`server:defer`)**: lets a static cached page defer personalized or dynamic server fragments without blocking the initial HTML shell.

