---
id: aws
name: "AWS"
kind: platform
status: planned
tags: [aws, cloud, infrastructure, devops, serverless]
what: "Amazon Web Services, the world's most comprehensive cloud computing platform offering hundreds of managed services including compute, storage, databases, and networking."
why: "Provides enterprise-grade scalability, fine-grained IAM access control, compliance certifications, and foundational services (EC2, S3, Lambda, RDS, SES)."
problem: "Building large-scale applications on niche PaaS hosts eventually encounters vendor ceilings in service variety, compliance certifications, or custom networking."
relations:
  - { to: aws-ses, label: "part of" }
  - { to: docker, label: "integrates with" }
  - { to: terraform, label: "integrates with" }
links:
  - { title: "AWS Documentation", url: "https://docs.aws.amazon.com/" }
  - { title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/" }
alsoIn: []
source: self-study
---

## Example
```ts
// Using AWS SDK v3 in Node.js to upload files to Amazon S3
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  // In production (ECS/EC2/Lambda), credentials resolve automatically via IAM roles
});

export async function uploadAsset(key: string, buffer: Buffer, mimeType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  return await s3Client.send(command);
}
```

## Key points
- **Shared responsibility model**: AWS manages security of the cloud (hardware, facilities, hypervisors); you manage security in the cloud (IAM policies, VPC network security groups, encryption keys, application patches).
- **IAM least-privilege principle**: grant only the minimum necessary permissions to individual roles and services; avoid using root account credentials or overly broad wildcards (`s3:*`).
- **Billing alerts & budgets**: set up AWS Budgets and CloudWatch billing alarms immediately upon account creation to prevent unexpected charges from unmonitored resources.
