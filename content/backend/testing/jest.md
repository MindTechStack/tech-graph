---
id: jest
name: "Jest"
kind: tool
status: learned
tags: [testing, test-runner, assertions, mocks, snapshot-testing]
what: "JavaScript and TypeScript test framework with runner, assertions, mocks and coverage in one package."
why: "Zero-configuration setup for common projects that bundles what previously required Mocha, Chai, Sinon, and c8 into one cohesive, parallelized tool."
problem: "Assembling and configuring separate test runners, assertion libraries, mock managers, and coverage generators creates brittle toolchain maintenance."
relations:
  - { to: "mocha", label: "modern alternative to" }
  - { to: "supertest", label: "runs assertions with" }
  - { to: "nodejs", label: "test runner for" }
  - { to: "typescript", label: "tests written in" }
links:
  - { title: "Jest Documentation", url: https://jestjs.io/ }
  - { title: "Jest API Reference", url: https://jestjs.io/docs/api }
alsoIn: []
source: course
---

## Example
```ts
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fetchUserProfile } from "../src/user-api";
import { apiClient } from "../src/http-client";

describe("fetchUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns user profile when network request succeeds", async () => {
    const mockUser = { id: "u-101", username: "alex", role: "admin" };
    const getSpy = jest.spyOn(apiClient, "get").mockResolvedValue({ data: mockUser });

    const result = await fetchUserProfile("u-101");

    expect(result).toEqual(mockUser);
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith("/users/u-101");
  });

  it("throws formatted error on 404 response", async () => {
    jest.spyOn(apiClient, "get").mockRejectedValue(new Error("Not Found"));

    await expect(fetchUserProfile("unknown")).rejects.toThrow("Not Found");
  });
});
```

## Key points
- **Core mental model**: All-in-one isolated worker test runner — runs test suites in parallel worker threads with isolated global contexts, integrated mocking (`jest.fn()`), and snapshot comparisons.
- **Common pitfall**: Slow startup and memory leaks when running large TypeScript test suites with `ts-jest`; using `@swc/jest` or migrating to Vitest drastically improves test execution speeds.
- **Today**: Jest established the modern standard for JavaScript test runners, though Vitest is now favored for Vite-based and modern ESM-first applications.
