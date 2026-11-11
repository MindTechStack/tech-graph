---
id: chai
name: "Chai"
kind: library
status: learned
tags: [testing, assertions, bdd, tdd, expectations]
what: "BDD and TDD assertion library for Node.js and browsers that pairs with any JavaScript testing framework."
why: "Offers expressive, human-readable natural language assertion styles (expect, should, and assert) that produce clear failure error messages."
problem: "Raw Node.js assert.strictEqual() provides cryptic assertion failure outputs and cumbersome syntax for deep object equality or array inclusion checks."
relations:
  - { to: "mocha", label: "assertion library for" }
  - { to: "sinon", label: "paired with" }
  - { to: "supertest", label: "used with" }
links:
  - { title: "Chai Assertion Library", url: https://www.chaijs.com/ }
  - { title: "Chai BDD Expect API", url: https://www.chaijs.com/api/bdd/ }
alsoIn: []
source: course
---

## Example
```js
import { expect } from "chai";

describe("Shopping Cart Calculations", () => {
  it("validates line items and totals correctly", () => {
    const cart = {
      items: [
        { id: 1, name: "Keyboard", price: 80, quantity: 1 },
        { id: 2, name: "Mouse", price: 40, quantity: 2 },
      ],
      discountCode: "SUMMER10",
      total: 144, // 160 - 10%
    };

    // BDD chaining style assertions
    expect(cart).to.be.an("object");
    expect(cart.items).to.be.an("array").with.lengthOf(2);
    expect(cart.total).to.be.a("number").and.to.equal(144);

    // Deep structural inspection
    expect(cart.items[0]).to.include({ name: "Keyboard", price: 80 });
    expect(cart).to.have.property("discountCode").that.is.a("string");
  });
});
```

## Key points
- **Core mental model**: Chainable English-like grammar — uses readable getter chains (`expect(res).to.be.an('object').that.has.property('id')`) to construct assertions.
- **Common pitfall**: Calling terminal properties like `.to.be.true` without parentheses in older linters; accidental typos like `.to.be.tru` silently evaluate to truthy properties without throwing assertions unless using `chai-lint` or strict types.
- **Today**: Chai 5 migrated completely to pure ESM and TypeScript; in projects using Jest or Vitest, built-in `expect` assertions have largely replaced standalone Chai installations.
