---
id: sinon
name: "Sinon"
kind: library
status: learned
tags: [testing, mocks, stubs, spies, test-doubles]
what: "Standalone test spies, stubs, and mocks library for JavaScript that integrates with any unit testing framework."
why: "Allows isolating units under test by intercepting function calls, simulating third-party API responses, and faking system clocks without touching real external services."
problem: "Testing code that depends on databases, external email services, or system timers directly makes tests slow, flaky, stateful, and non-deterministic."
relations:
  - { to: "mocha", label: "mocking library for" }
  - { to: "chai", label: "paired with" }
  - { to: "jest", label: "alternative to built-in mocks of" }
links:
  - { title: "Sinon.js Documentation", url: https://sinonjs.org/ }
alsoIn: []
source: course
---

## Example
```js
import sinon from "sinon";
import { expect } from "chai";
import { OrderService } from "../src/order-service.js";
import { PaymentGateway } from "../src/payment-gateway.js";

describe("OrderService", () => {
  afterEach(() => {
    // Restore all spies and stubs to prevent test pollution
    sinon.restore();
  });

  it("charges payment and sends receipt on order placement", async () => {
    // Stub external payment call
    const chargeStub = sinon.stub(PaymentGateway, "charge").resolves({ success: true, txnId: "tx_999" });

    // Spy on email notification
    const emailSpy = sinon.spy(OrderService, "sendReceipt");

    const order = await OrderService.placeOrder({ amount: 150, customerId: "cust_123" });

    expect(chargeStub.calledOnce).to.be.true;
    expect(chargeStub.firstCall.args[0]).to.deep.equal({ amount: 150, customerId: "cust_123" });
    expect(emailSpy.calledWith(order.id)).to.be.true;
  });
});
```

## Key points
- **Core mental model**: Spies (record arguments and returns), Stubs (replace functions with programmed responses), and Mocks (pre-programmed expectations) — use stubs for predictable responses and spies for verifying calls.
- **Common pitfall**: Forgetting to restore stubs in `afterEach(() => sinon.restore())`; leaving stubs active mutates global or prototype functions, causing cascading test pollution and silent failures in subsequent test files.
- **Today**: In modern Jest and Vitest suites, built-in utilities (`vi.fn()`, `vi.spyOn()`, `jest.spyOn()`) have largely replaced standalone Sinon, though Sinon remains standard in Mocha environments.
