---
id: mailchimp
name: "Mailchimp"
kind: service
status: learned
tags: [email, marketing, newsletter, campaigns, saas]
what: "Email marketing service for subscriber lists, newsletters, automations and audience segments."
why: "Provides non-technical marketing teams with visual drag-and-drop template builders, automated drip campaigns, audience tags, and detailed campaign performance analytics."
problem: "Using transactional email tools or raw SMTP for bulk marketing campaigns violates unsubscribe compliance laws such as CAN-SPAM and GDPR and risks blacklisting transactional IPs."
relations:
  - { to: "nodemailer", label: "alternative to" }
  - { to: "sendgrid", label: "alternative to" }
  - { to: "nodejs", label: "client library for" }
links:
  - { title: "Mailchimp Marketing API", url: https://mailchimp.com/developer/marketing/api/ }
  - { title: "Mailchimp Transactional (Mandrill)", url: https://mailchimp.com/developer/transactional/ }
alsoIn: []
source: course
---

## Example
```js
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g. "us1"
});

export async function addSubscriber(listId, user) {
  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: user.email,
      status: "subscribed",
      merge_fields: {
        FNAME: user.firstName,
        LNAME: user.lastName,
      },
      tags: ["web-signup", "newsletter-subscriber"],
    });

    return response.id;
  } catch (error) {
    if (error.status === 400 && error.response?.text?.includes("Member Exists")) {
      // Gracefully handle existing subscriber
      return null;
    }
    throw error;
  }
}
```

## Key points
- **Core mental model**: Audience-centric marketing vs recipient-centric transactional — Mailchimp manages long-term subscriber lifecycle state (subscribed, unsubscribed, cleaned, tags) and automatically enforces legal one-click unsubscribe headers.
- **Common pitfall**: Conflating Mailchimp's Marketing API (newsletters, audience sync) with Mailchimp Transactional (formerly Mandrill, used for password resets and receipts); using the marketing API for transactional emails introduces multi-minute queuing delays.
- **Today**: Modern product-led engineering teams often prefer customer-data platforms like Customer.io, Loops, or Resend Audiences for tightly integrated TypeScript and developer-centric email marketing workflows.
