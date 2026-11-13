---
id: sendgrid
name: "SendGrid"
kind: service
status: learned
tags: [email, transactional-email, saas, api, cloud]
what: "Twilio's hosted email service that delivers transactional and marketing mail through a REST API or SMTP relay."
why: "Guarantees high inbox deliverability, handles SPF, DKIM, and DMARC domain authentication, and provides automated analytics for bounces, spam reports, and engagement."
problem: "Self-hosted SMTP servers are frequently blacklisted or delayed by major email providers like Gmail and Outlook due to poor IP reputation and missing reputation warming."
relations:
  - { to: "nodemailer", label: "integrates with" }
  - { to: "aws-ses", label: "alternative to" }
  - { to: "mailchimp", label: "complements" }
links:
  - { title: "SendGrid Documentation", url: https://docs.sendgrid.com/ }
  - { title: "SendGrid Node.js SDK", url: https://github.com/sendgrid/sendgrid-nodejs }
alsoIn: []
source: course
---

## Example
```js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOrderReceipt(userEmail, order) {
  const msg = {
    to: userEmail,
    from: "orders@example.com",
    templateId: "d-1234567890abcdef1234567890abcdef",
    dynamicTemplateData: {
      customerName: order.customerName,
      orderNumber: order.id,
      totalAmount: `$${(order.total / 100).toFixed(2)}`,
      items: order.items,
    },
  };

  try {
    const [response] = await sgMail.send(msg);
    return response.statusCode;
  } catch (error) {
    if (error.response) {
      console.error("SendGrid API error:", error.response.body);
    }
    throw error;
  }
}
```

## Key points
- **Core mental model**: HTTP REST API over raw SMTP — sending via SendGrid's REST API (`@sendgrid/mail`) is significantly faster, avoids TLS socket connection overhead, and easily bypasses firewall port blocks (port 25).
- **Common pitfall**: Failing to configure custom domain authentication (DKIM, SPF, CNAME records) in DNS; unauthenticated emails land directly in the user's spam folder or trigger "via sendgrid.net" security warnings.
- **Today**: Twilio SendGrid is widely used for transactional system emails (password resets, notifications), while dedicated developer-first competitors like Postmark and Resend compete heavily on DX and React Email integration.
