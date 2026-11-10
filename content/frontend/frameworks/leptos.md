---
id: leptos
name: Leptos (Rust)
kind: framework
status: practiced
tags: [rust, wasm, signals, ssr, fullstack]
what: "Full-stack, isomorphic Rust web framework using fine-grained reactive signals, compiling to native server binaries and WebAssembly for client hydration."
why: "Brings Rust's memory safety, algebraic types, and shared client/server `#[server]` functions to reactive web applications without a Virtual DOM."
problem: "Sharing complex domain validation or CPU-intensive logic between a Rust backend and a separate TypeScript frontend requires duplicating types and serialization code."
relations:
  - { to: html, label: "renders view! macro to" }
  - { to: svelte, label: "shares fine-grained signal model with" }
links:
  - { title: "Leptos Book", url: https://book.leptos.dev/ }
  - { title: "Leptos GitHub Repository", url: https://github.com/leptos-rs/leptos }
alsoIn: []
source: personal
---

## Example
```rust
use leptos::prelude::*;

#[server]
pub async fn save_metric(name: String, value: i32) -> Result<String, ServerFnError> {
    Ok(format!("Saved {name} = {value}"))
}

#[component]
pub fn Counter() -> impl IntoView {
    let (count, set_count) = signal(0);
    let doubled = move || count.get() * 2;

    view! {
        <button on:click=move |_| *set_count.write() += 1>
            "Count: " {count} " (x2 = " {doubled} ")"
        </button>
    }
}
```

## Key points
- **Component functions run once**: unlike React, a Leptos `#[component]` function executes a single time to set up the reactive graph; only signal closures (`move || count.get()`) re-run when their tracked signals update.
- **Isomorphic `#[server]` functions**: annotate an async Rust function with `#[server]` and call it directly from UI code—the macro generates the HTTP endpoint on the server and a serialized `fetch` stub in WASM.
- **WASM bundle size**: enable `wasm-opt -Oz`, `lto = true`, and `codegen-units = 1` in `Cargo.toml` release profiles to keep hydrated WASM payloads compact.

