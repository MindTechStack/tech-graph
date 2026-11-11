---
id: vue-i18n
name: Vue I18n
kind: library
status: work
tags: [i18n, internationalization, localization, vue, translations]
what: "Internationalization and localization plugin for Vue.js applications."
why: "Simplifies managing multi-language UI strings, pluralization rules, and number and datetime formatting across components."
problem: "Hardcoding natural language strings directly into templates prevents localization and creates messy conditional string logic."
relations:
  - { to: vue, label: "plugin for" }
  - { to: composition-api, label: "provides composables for" }
  - { to: vue-router, label: "syncs locale with" }
links:
  - { title: "Vue I18n Documentation", url: https://vue-i18n.intlify.dev }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t, locale, n } = useI18n({ useScope: "global" });

function switchLocale(nextLocale: "en" | "uk"): void {
  locale.value = nextLocale;
}
</script>

<template>
  <div class="i18n-demo">
    <header>
      <h1>{{ t("welcome.title", { name: "Alex" }) }}</h1>
      <p>{{ t("cart.summary", { count: 3 }) }}</p>
      <span>{{ n(1250.5, "currency") }}</span>
    </header>
    <div class="lang-switch">
      <button type="button" @click="switchLocale('en')">English</button>
      <button type="button" @click="switchLocale('uk')">Ukrainian</button>
    </div>
  </div>
</template>
```

## Key points
- **Composition API integration**: `useI18n({ useScope: 'global' })` provides reactive `t()`, `locale`, and locale-switching composables inside `<script setup>`.
- **Pluralization and interpolation**: Supports named interpolation (`{name}`), list formatting, linked messages (`@:common.ok`), and pluralization pipes (`0 items | 1 item | {n} items`).
- **Async locale loading**: In production apps, avoid bundling all translations in the initial chunk; dynamically fetch JSON message bundles on language switch.
