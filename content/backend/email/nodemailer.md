---
id: nodemailer
name: "Nodemailer"
kind: library
status: learned
tags: [email, smtp, nodejs, transactional-email, backend]
what: "Zero-dependency module for Node.js applications to send emails via SMTP, sendmail, or cloud service transports."
why: "Provides a unified, flexible API to compose HTML and plain-text emails, attach files, embed inline images, and dispatch them across multiple email providers."
problem: "Without it, developers must manually open raw TCP sockets, implement the complex RFC 5321 SMTP protocol handshake, and format MIME multipart bodies."
relations:
  - { to: "nodejs", label: "runs on" }
  - { to: "express", label: "used in" }
  - { to: "sendgrid", label: "transport for" }
links:
  - { title: "Nodemailer Documentation", url: https://nodemailer.com/ }
alsoIn: []
source: course
---

## Example
```js
import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.mailtrap.io",
  port: Number(process.env.SMTP_PORT ?? 2525),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(userEmail, userName, confirmationToken) {
  const verifyUrl = `https://example.com/verify?token=${confirmationToken}`;

  const info = await transporter.sendMail({
    from: '"Acme Platform" <no-reply@example.com>',
    to: userEmail,
    subject: "Confirm your Acme account",
    text: `Hello ${userName},\n\nPlease confirm your account: ${verifyUrl}`,
    html: `
      <h2>Hello ${userName}!</h2>
      <p>Thanks for signing up. Please click below to verify your email:</p>
      <a href="${verifyUrl}" style="padding:10px 16px;background:#3b82f6;color:#fff;border-radius:4px;text-decoration:none;">
        Verify Email
      </a>
    `,
  });

  return info.messageId;
}
```

## Key points
- **Core mental model**: Transporters decouple message definition (`from`, `to`, `subject`, `html`, `attachments`) from the transport mechanism (SMTP, AWS SES, SendGrid, or test accounts like Ethereal).
- **Common pitfall**: Awaiting `transporter.sendMail()` directly inside an HTTP request handler; SMTP handshakes introduce network latency (500ms–3s) that can block web responses or time out under load. Always delegate email dispatch to a background queue (e.g. BullMQ).
- **Today**: In local development and automated CI tests, pair Nodemailer with Ethereal Email (`nodemailer.createTestAccount()`) or local containerized mail catchers (Mailpit/MailHog) rather than real credentials.
