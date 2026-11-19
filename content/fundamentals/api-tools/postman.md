---
id: postman
name: "Postman"
kind: tool
status: work
tags: [postman, api-testing, rest, http, collections]
what: "API client and collaboration platform for sending, testing, documenting and mocking HTTP, GraphQL and WebSocket APIs."
why: "Provides an intuitive graphical interface for creating complex request collections, chained test assertions (pm.test), environment variables, and automated mock servers."
problem: "Manual endpoint testing with browser DevTools or raw cURL lacks assertion automation, collection organization, and team workspace synchronization."
relations:
  - { to: api-clients, label: "part of" }
  - { to: rest-api, label: "tests" }
  - { to: express, label: "tests" }
links:
  - { title: "Postman Documentation", url: "https://learning.postman.com/docs/getting-started/overview/" }
  - { title: "Postman Scripting Reference", url: "https://learning.postman.com/docs/writing-scripts/script-references/test-examples/" }
alsoIn: []
source: course
---

## Example
```js
// Postman Tests tab: validating response and chaining token to environment
pm.test("Status code is 200 OK", function () {
  pm.response.to.have.status(200);
});

pm.test("Response contains valid JWT token", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("token");
  pm.expect(jsonData.user.role).to.eql("admin");

  // Save extracted token into active Postman environment
  pm.environment.set("jwt_token", jsonData.token);
});

pm.test("Response time is under 200ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(200);
});
```

## Key points
- **Environments & variables**: use environment variables (`{{baseUrl}}`, `{{jwt_token}}`) to switch seamlessly between `local`, `staging`, and `production` environments without modifying request definitions.
- **Newman CLI for CI/CD**: export Postman collections and run automated end-to-end API test suites in continuous integration pipelines using the `newman run collection.json -e env.json` command.
- **Cloud workspace shift**: modern versions of Postman require cloud accounts for most collaborative features; for strict offline or local Git-only workflows, consider Bruno or `.http` files.
