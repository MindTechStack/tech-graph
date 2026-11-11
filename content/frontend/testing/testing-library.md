---
id: testing-library
name: "Testing Library"
kind: library
status: planned
tags: [component-testing, user-centric, accessibility, dom-testing, queries]
what: "Simple and complete testing utilities that encourage writing tests that closely resemble how real users interact with your web application."
why: "Avoids brittle tests that rely on internal implementation details, ensuring tests remain green through major refactorings as long as user behavior holds."
problem: "Tests asserting component internal state, private methods, or CSS selectors frequently break during harmless refactoring and miss real user-facing bugs."
relations:
  - { to: vitest, label: "runs within" }
  - { to: react, label: "tests" }
  - { to: vue, label: "tests" }
links:
  - { title: "Testing Library Documentation", url: "https://testing-library.com/docs/" }
alsoIn: []
source: self-study
---

## Example
```tsx
// Component test focusing on accessible user behavior
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { FilterBar } from "./FilterBar";

test("filters nodes by search query when typed by user", async () => {
  const user = userEvent.setup();
  const handleSearch = vi.fn();
  render(<FilterBar onSearch={handleSearch} />);

  // Query by accessible role rather than CSS class names
  const input = screen.getByRole("searchbox", { name: /filter/i });
  await user.type(input, "performance");

  expect(input).toHaveValue("performance");
});
```

## Key points
- **Guiding principle**: the more your tests resemble the way your software is used, the more confidence they can give you.
- **Accessible priority queries**: queries by role (`getByRole`), label text (`getByLabelText`), and text content (`getByText`) encourage accessible markup by design.
- **Ecosystem breadth**: provides consistent query APIs across DOM, React, Vue, Angular, Svelte, and React Native.
