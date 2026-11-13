---
id: mocha
name: "Mocha"
kind: tool
status: learned
tags: [testing, test-runner, tdd, bdd, async-testing]
what: "JavaScript test runner for Node.js and the browser; assertions, mocks and coverage come from separate libraries."
why: "Provides an unopinionated test execution engine where developers choose their own assertion libraries (Chai), mocking tools (Sinon), and coverage utilities (c8)."
problem: "Writing tests with raw Node.js assert statements lacks test suite organization (describe/it), lifecycle hooks (beforeEach/afterEach), and structured test reports."
relations:
  - { to: "chai", label: "paired with" }
  - { to: "sinon", label: "paired with" }
  - { to: "jest", label: "predecessor of" }
  - { to: "nodejs", label: "runs on" }
links:
  - { title: "Mocha Documentation", url: https://mochajs.org/ }
alsoIn: []
source: course
---

## Example
```js
import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import { UserService } from "../src/user-service.js";

describe("UserService", () => {
  let userService;
  let dbStub;

  beforeEach(() => {
    dbStub = { findById: sinon.stub() };
    userService = new UserService(dbStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return formatted user profile when user exists", async () => {
    dbStub.findById.resolves({ id: 10, name: "Alice", email: "alice@example.com" });

    const result = await userService.getUser(10);

    expect(result).to.deep.equal({
      id: 10,
      displayName: "Alice (alice@example.com)",
    });
    expect(dbStub.findById.calledOnceWith(10)).to.be.true;
  });
});
```

## Key points
- **Core mental model**: Pluggable test runner — Mocha supplies test discovery, runner lifecycle hooks, and report formatting, deliberately leaving assertions and mocks to external libraries.
- **Common pitfall**: Mixing `done` callbacks with async/await Promises; returning a Promise from an `it('...', async (done) => ...)` block causes "resolution of multiple callbacks" errors in Mocha.
- **Today**: Mocha remains widely used in legacy and modular Node.js codebases, though modern greenfield projects usually adopt all-in-one runners like Vitest or Jest.
