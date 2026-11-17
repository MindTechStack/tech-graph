---
id: http-files
name: ".http files (VS Code REST Client)"
short: ".http files"
kind: tool
status: planned
tags: [http-files, rest-client, vscode, api-testing, git]
what: "Standardized plaintext HTTP request files (.http or .rest) executed directly inside VS Code and JetBrains IDEs via lightweight editor extensions."
why: "Keeps executable API requests directly in the project codebase alongside source files without needing external GUI client applications."
problem: "Switching between code editors and heavy external API tools breaks developer flow, while sharing collections via export files quickly becomes desynchronized."
relations:
  - { to: api-clients, label: "part of" }
  - { to: git, label: "integrates with" }
  - { to: express, label: "tests" }
links:
  - { title: "VS Code REST Client Extension", url: "https://marketplace.visualstudio.com/items?itemName=humao.rest-client" }
  - { title: "JetBrains HTTP Client", url: "https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html" }
alsoIn: []
source: self-study
---

## Example
```http
# File: test-api.http
# Click "Send Request" above any request line in VS Code

@host = http://localhost:3000
@contentType = application/json

### 1. Authenticate user and extract token
# @name login
POST {{host}}/api/auth/login HTTP/1.1
Content-Type: {{contentType}}

{
  "email": "user@example.com",
  "password": "Password123!"
}

### 2. Capture token from step 1 response
@authToken = {{login.response.body.token}}

### 3. Authorized request using captured token
GET {{host}}/api/orders HTTP/1.1
Authorization: Bearer {{authToken}}
Accept: {{contentType}}

### 4. Create an order with custom headers
POST {{host}}/api/orders HTTP/1.1
Authorization: Bearer {{authToken}}
Content-Type: {{contentType}}

{
  "items": [
    { "id": "item-99", "quantity": 3 }
  ]
}
```

## Key points
- **Zero context switching**: run, debug, and inspect HTTP requests directly within your code editor without launching separate desktop applications.
- **Checked into Git**: `.http` files live in the repository right next to your route controllers, ensuring requests and documentation evolve atomically alongside code changes.
- **Request chaining with `# @name`**: tag any request with `# @name requestName` and reference its response headers or JSON body fields in subsequent requests via `{{requestName.response.body.path}}`.
