---
id: svelte
name: Svelte 5
kind: framework
status: practiced
tags: [compiler, runes, signals, reactivity, components]
what: "Compiler-first UI framework that compiles `.svelte` components into surgical DOM updates powered by fine-grained signals called Runes (`$state`, `$derived`, `$effect`)."
why: "Eliminates Virtual DOM diffing overhead and ships compact JavaScript bundles with explicit, universal reactivity inside both `.svelte` and `.svelte.ts` modules."
problem: "Runtime-heavy frameworks ship a large runtime and re-execute entire component functions on state changes unless carefully memoized."
relations:
  - { to: sveltekit, label: "powers" }
  - { to: typescript, label: "typed with" }
  - { to: vite, label: "compiled via" }
links:
  - { title: "Svelte 5 Documentation", url: https://svelte.dev/docs/svelte/overview }
alsoIn: []
source: personal
---

## Example
```svelte
<script lang="ts">
  interface Props {
    initial?: number;
  }

  let { initial = 1 }: Props = $props();
  let count = $state(initial);
  let doubled = $derived(count * 2);
</script>

<div class="counter">
  <button type="button" onclick={() => count++}>
    Count: {count} (×2 = {doubled})
  </button>
</div>
```

## Key points
- **Runes in Svelte 5**: `$state()`, `$derived()`, `$effect()`, and `$props()` replace Svelte 3/4's implicit `let` and `$:` reactive labels, working identically inside `.svelte` components and shared `.svelte.ts` files.
- **Snippets over legacy slots**: Svelte 5 replaces `<slot>` with `{#snippet row(item)}...{/snippet}` and `{@render row(item)}`, giving full lexical scoping and TypeScript safety.
- **Avoid `$effect` for derived state**: compute values synchronously with `$derived` or `$derived.by(() => ...)`; use `$effect` only for imperative DOM or third-party library synchronization.

