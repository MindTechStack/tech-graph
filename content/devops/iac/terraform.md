---
id: terraform
name: "Terraform"
kind: tool
status: planned
tags: [terraform, iac, hcl, devops, cloud-provisioning]
what: "An industry-standard open-source Infrastructure as Code tool created by HashiCorp for provisioning multi-cloud resources using declarative HashiCorp Configuration Language (HCL)."
why: "Provides a vast provider ecosystem (AWS, GCP, Azure, Cloudflare) with deterministic state tracking, dependency graphing, and execution plans ('terraform plan')."
problem: "Multi-cloud deployments using provider-specific templates (CloudFormation, ARM) require maintaining separate tooling and disparate configuration models."
relations:
  - { to: iac, label: "part of" }
  - { to: aws, label: "integrates with" }
  - { to: cloudflare, label: "integrates with" }
  - { to: alchemy, label: "alternative to" }
links:
  - { title: "Terraform Documentation", url: "https://developer.hashicorp.com/terraform/docs" }
  - { title: "Terraform Registry", url: "https://registry.terraform.io/" }
alsoIn: []
source: self-study
---

## Example
```hcl
# main.tf - Declarative AWS S3 Bucket and Cloudflare DNS setup
terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket         = "company-terraform-states"
    key            = "prod/app.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}

resource "aws_s3_bucket" "assets" {
  bucket = "company-prod-static-assets"

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

output "bucket_arn" {
  description = "ARN of the provisioned S3 assets bucket"
  value       = aws_s3_bucket.assets.arn
}
```

## Key points
- **Plan and apply workflow**: `terraform plan` previews exactly what resources will be added, changed, or destroyed before `terraform apply` makes any real infrastructure modifications.
- **Remote state locking**: store `terraform.tfstate` in remote backends (such as AWS S3 with DynamoDB locking) to prevent conflicting concurrent infrastructure mutations within teams.
- **Module reusability**: package complex infrastructure patterns into reusable Terraform modules with parameterized inputs and outputs across staging and production environments.
