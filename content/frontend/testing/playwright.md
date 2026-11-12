---
id: playwright
name: "Playwright"
kind: tool
status: work
core: true
tags: [e2e-testing, browser-automation, cross-browser, visual-regression, ci]
what: "Modern end-to-end testing and browser automation framework from Microsoft that tests across Chromium, Firefox, and WebKit with a single API."
why: "Eliminates flaky tests with auto-waiting assertions, network interception, web-first locators, and interactive tracing."
problem: "Traditional E2E test tools like Cypress or Selenium suffer from arbitrary sleep timeouts, flakiness, and limited cross-engine browser fidelity."
relations:
  - { to: typescript, label: "written with" }
  - { to: vitest, label: "complements" }
  - { to: browser-apis, label: "automates" }
links:
  - { title: "Playwright Documentation", url: "https://playwright.dev/" }
alsoIn: []
source: work
---

## Example
```ts
// tests/graph-navigation.spec.ts - Playwright E2E test
import { test, expect } from "@playwright/test";

test("navigates knowledge graph and opens node modal", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Web-first locator with automatic retry and visibility check
  const searchInput = page.getByRole("textbox", { name: /search nodes/i });
  await searchInput.fill("Vitest");

  const nodeCard = page.getByRole("button", { name: "Vitest" });
  await expect(nodeCard).toBeVisible();
  await nodeCard.click();

  const modalHeading = page.getByRole("heading", { name: "Vitest", level: 2 });
  await expect(modalHeading).toBeVisible();
});
```

## Key points
- **Auto-wait resilience**: automatically waits for elements to be actionable, attached, and stable before executing clicks or fills, eliminating manual sleeps.
- **Trace Viewer**: captures DOM snapshots, action logs, console output, and network HAR files for step-by-step post-mortem test debugging.
- **Full engine coverage**: runs genuine rendering engines for Chromium, WebKit (Safari), and Firefox in headless or headed mode across Windows, Linux, and macOS.
