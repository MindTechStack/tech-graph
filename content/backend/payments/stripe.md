---
id: stripe
name: "Stripe"
kind: service
status: learned
tags: [payments, billing, webhooks, checkout, subscriptions]
what: "Financial infrastructure and developer-first payment platform for processing online card transactions, recurring subscriptions, and multi-party payouts."
why: "Eliminates PCI-DSS compliance scope by tokenizing cardholder data client-side and provides a battle-tested API for Checkout sessions, Payment Intents, and Webhooks."
problem: "Handling raw credit card numbers on your server requires severe and costly Level 1 PCI-DSS audits, bank relationships, and constant fraud liability."
relations:
  - { to: "nodejs", label: "sdk for" }
  - { to: "express", label: "webhook receiver in" }
  - { to: "http-status-codes", label: "uses" }
links:
  - { title: "Stripe API Documentation", url: https://stripe.com/docs/api }
  - { title: "Stripe Webhooks Guide", url: https://stripe.com/docs/webhooks }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const app = express();

// 1. Create a hosted Checkout Session
app.post("/api/checkout", express.json(), async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Pro Subscription" },
          unit_amount: 2900, // $29.00 in cents
        },
        quantity: 1,
      },
    ],
    success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://example.com/cancel",
  });

  res.status(200).json({ url: session.url });
});

// 2. Webhook listener MUST receive the raw unparsed body to verify HMAC signature
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Authoritatively fulfill order and grant access in database
    console.log("Order paid successfully:", session.id);
  }

  res.status(200).json({ received: true });
});
```

## Key points
- **Core mental model**: Asynchronous fulfillment via Webhooks — never fulfill purchases on the client-side redirect (`success_url`), as users may close the browser tab before returning; only grant access after receiving a cryptographically verified `checkout.session.completed` webhook.
- **Common pitfall**: Parsing the webhook route body with `express.json()` before verifying the signature; Stripe requires the untouched, raw binary buffer (`express.raw()`) to calculate the HMAC-SHA256 signature match.
- **Today**: Stripe Checkout and Stripe Elements (Payment Element) automatically handle 3D Secure 2, Apple Pay, Google Pay, and regional Strong Customer Authentication (SCA) compliance without custom front-end card inputs.
