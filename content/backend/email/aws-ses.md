---
id: aws-ses
name: "Amazon SES"
kind: service
status: learned
tags: [email, aws, cloud, smtp, transactional-email]
what: "AWS service for sending and receiving transactional and bulk email, priced per message."
why: "Offers extremely low pricing ($0.10 per 1,000 emails) combined with high throughput, tight AWS IAM security integration, and automated SNS bounce and complaint handling."
problem: "Commercial transactional email SaaS providers become prohibitively expensive at scale (millions of emails per month) with rigid subscription tiers and vendor lock-in."
relations:
  - { to: "nodemailer", label: "integrates with" }
  - { to: "sendgrid", label: "alternative to" }
  - { to: "nodejs", label: "consumed by" }
links:
  - { title: "Amazon SES Documentation", url: https://docs.aws.amazon.com/ses/ }
  - { title: "AWS SDK SES v3 Reference", url: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ses/ }
alsoIn: []
source: course
---

## Example
```js
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.AWS_REGION ?? "us-east-1" });

export async function sendPasswordReset(toEmail, resetUrl) {
  const command = new SendEmailCommand({
    Source: "security@example.com",
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: "Password Reset Request",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `<p>Click here to reset your password: <a href="${resetUrl}">Reset Password</a></p>`,
          Charset: "UTF-8",
        },
        Text: {
          Data: `Reset your password by visiting: ${resetUrl}`,
          Charset: "UTF-8",
        },
      },
    },
  });

  const response = await ses.send(command);
  return response.MessageId;
}
```

## Key points
- **Core mental model**: Production sandbox boundary — newly created AWS SES accounts are restricted to sandbox mode, allowing emails only to verified addresses and domains until a formal production quota request is submitted and approved.
- **Common pitfall**: Ignoring bounce and complaint feedback loops; failing to handle AWS SNS bounce notifications will drive your complaint rate above AWS's 0.1% threshold, resulting in automatic account suspension.
- **Today**: Amazon SES remains the benchmark for low-cost, high-reliability infrastructure; high-level tools like Nodemailer or self-hosted forwarders frequently configure SES as their underlying SMTP or API transport.
