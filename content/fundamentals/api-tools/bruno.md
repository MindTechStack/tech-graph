---
id: bruno
name: "Bruno"
kind: tool
status: planned
tags: [bruno, api-client, git-friendly, rest, offline-first]
what: "A fast, open-source, offline-first API client that stores collections directly in your filesystem as plain-text Bru markup files."
why: "Enables versioning of API collections directly in Git alongside application source code without cloud accounts, vendor lock-in, or secret sync issues."
problem: "Cloud-first API clients force company API secrets and proprietary schemas into third-party cloud workspaces, risking data breaches and subscription paywalls."
relations:
  - { to: api-clients, label: "part of" }
  - { to: postman, label: "alternative to" }
  - { to: git, label: "integrates with" }
links:
  - { title: "Bruno Official Site", url: "https://www.usebruno.com/" }
  - { title: "Bruno GitHub Repository", url: "https://github.com/usebruno/bruno" }
alsoIn: []
source: self-study
---

## Example
```bru
meta {
  name: Get User Profile
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/api/v1/users/:userId
  body: none
  auth: bearer
}

params:path {
  userId: 42
}

headers {
  Accept: application/json
  X-Request-Source: bruno-client
}

auth:bearer {
  token: {{accessToken}}
}

assert {
  res.status: eq 200
  res.body.email: matches ^.+@.+\..+$
}

script:post-response {
  if (res.getStatus() === 200) {
    bru.setEnvVar("lastCheckedUser", res.getBody().id);
  }
}
```

## Key points
- **Plain-text `.bru` format**: requests, assertions, and headers are stored in a human-readable markup format that produces clean, mergeable diffs in Git pull requests.
- **100% offline & private**: Bruno never stores your API collections or tokens on external servers; everything stays local on developer machines.
- **npm script execution**: supports importing external npm packages and custom Node.js scripts directly in pre-request and post-response script blocks.
