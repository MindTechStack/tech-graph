---
id: iac
name: "Infrastructure as Code"
kind: concept
status: planned
tags: [iac, devops, cloud, infrastructure, automation]
what: "The practice of managing, provisioning, and configuring computer data centers and cloud resources through declarative definition files rather than manual console clicks."
why: "Makes infrastructure reproducible, auditable in Git, testable in CI, and immune to configuration drift across development, staging, and production environments."
problem: "Manual cloud console configuration ('ClickOps') leads to undocumented settings, untracked drifts, environment discrepancies, and unrepeatable disaster recovery."
relations:
  - { to: terraform, label: "implements" }
  - { to: alchemy, label: "implements" }
  - { to: git, label: "integrates with" }
links:
  - { title: "What is Infrastructure as Code (AWS)", url: "https://aws.amazon.com/what-is/iac/" }
  - { title: "HashiCorp What is IaC", url: "https://developer.hashicorp.com/terraform/intro" }
alsoIn: []
source: self-study
---

## Example
```yaml
# Conceptual comparison: Declarative IaC vs Imperative CLI Scripts

# Declarative IaC (What state the system should be in):
# "Ensure an S3 bucket named 'prod-app-assets' exists with private access."
# Running it 10 times results in the exact same state (Idempotent).

# Imperative Script (What specific steps to execute):
# aws s3 mb s3://prod-app-assets
# Running it a second time crashes with: "BucketAlreadyOwnedByYou".
```

## Key points
- **Declarative vs Imperative**: declarative tools (Terraform, CloudFormation, Alchemy) describe the desired end state, letting the engine determine the necessary creation, update, or destruction steps.
- **Drift detection & state tracking**: IaC maintains a state representation of the real infrastructure; running a plan detects unauthorized manual changes ("drift") made through web consoles.
- **GitOps for infrastructure**: infrastructure definitions undergo peer code reviews, automated CI syntax validation, security policy scanning (trivy/checkov), and auditable rollbacks.
