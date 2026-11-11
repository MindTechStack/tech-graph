---
id: quasar
name: "Quasar"
kind: framework
status: work
tags: [cross-platform, vue-framework, electron, capacitor, ssr]
what: "Vue-powered frontend framework that lets developers build SPAs, PWAs, SSR apps, desktop apps (Electron), and mobile apps (Capacitor/Cordova) from a single codebase."
why: "Drastically cuts development time by compiling one Vue codebase into responsive web, native mobile, and cross-platform desktop targets."
problem: "Maintaining separate codebases for web, iOS, Android, and desktop requires duplicate teams, conflicting logic, and slow feature velocity."
relations:
  - { to: vue, label: "built on" }
  - { to: vite, label: "build engine" }
  - { to: pwa, label: "supports" }
links:
  - { title: "Quasar Framework", url: "https://quasar.dev/" }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
import { useQuasar } from "quasar";

const $q = useQuasar();

function triggerNotification() {
  $q.notify({
    type: "positive",
    message: "Node synced across multi-platform storage!",
    position: "top-right",
    timeout: 2500,
  });
}
</script>

<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="min-width: 320px">
      <q-card-section>
        <div class="text-h6">Quasar Cross-Platform</div>
        <div class="text-subtitle2">Target: {{ $q.platform.is.desktop ? 'Desktop' : 'Mobile' }}</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="Notify" @click="triggerNotification" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
```

## Key points
- **Write once, deploy anywhere**: builds web SPA, SSR, PWA, mobile (Capacitor), and desktop (Electron) applications without modifying component logic.
- **Integrated component library**: includes over 70 high-performance UI components with native-feeling touch gestures and animations.
- **Quasar CLI & plugins**: provides pre-configured scaffolding, dev server HMR, and integrated runtime utilities like `$q.dialog` and `$q.notify`.
