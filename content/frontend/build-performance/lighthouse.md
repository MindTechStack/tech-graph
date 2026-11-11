---
id: lighthouse
name: "Lighthouse & Web Vitals"
kind: tool
status: work
tags: [performance-audit, web-vitals, seo, accessibility, metrics]
what: "Automated auditing tool developed by Google that evaluates web page performance, accessibility, SEO, and Core Web Vitals."
why: "Quantifies real-world user experience and search ranking factors using standardized metrics like LCP, INP, and CLS."
problem: "Without standardized audits, teams rely on subjective perceptions or local high-speed machines while mobile users suffer poor load times and input lag."
relations:
  - { to: code-splitting, label: "evaluates" }
  - { to: pwa, label: "audits" }
  - { to: vite, label: "audits output of" }
links:
  - { title: "Google Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/overview/" }
  - { title: "Core Web Vitals", url: "https://web.dev/explore/learn-core-web-vitals" }
alsoIn: []
source: work
---

## Example
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173/"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

## Key points
- **Core Web Vitals**: focuses on LCP (loading speed < 2.5s), INP (interaction responsiveness < 200ms), and CLS (visual layout stability < 0.1).
- **Lab vs field data**: Lighthouse generates synthetic lab data under throttled CPU/network; real-user monitoring (CrUX) captures field data across diverse hardware.
- **Automated CI gating**: integrating `@lhci/cli` into GitHub Actions prevents performance regressions before merging pull requests.
