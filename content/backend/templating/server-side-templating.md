---
id: server-side-templating
name: "Server-side Templating"
kind: concept
status: learned
tags: [templating, ssr, html, views, rendering]
what: "Technique of compiling HTML templates with dynamic server data on the backend before sending the fully rendered HTML document to the client browser."
why: "Delivers fast first-contentful paint, excellent SEO indexing, and straightforward state handling without requiring client-side JavaScript hydration."
problem: "Manually concatenating dynamic strings into raw HTML leads to syntax errors, hard-to-maintain code, and severe Cross-Site Scripting (XSS) injection vulnerabilities."
relations:
  - { to: "express", label: "configured with view engine in" }
  - { to: "mvc", label: "powers view layer in" }
  - { to: "ejs", label: "implemented by" }
links:
  - { title: "Express Template Engines Guide", url: "https://expressjs.com/en/guide/using-template-engines.html" }
  - { title: "MDN Server-Side Website Programming", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Introduction" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import path from "node:path";

const app = express();

// Register view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.get("/shop", async (req, res) => {
  const products = await getFeaturedProducts();
  res.render("shop/index", {
    pageTitle: "Featured Products",
    products,
    user: req.user,
  });
});
```

## Key points
- **Zero client hydration cost**: browsers receive ready-to-display HTML and CSS, rendering content immediately without downloading and executing heavy client SPA JavaScript bundles.
- **Built-in HTML escaping**: robust server templating engines escape dynamic variable interpolations by default, safeguarding against Cross-Site Scripting (XSS) attacks.
- **Full page roundtrips**: navigating pages triggers standard browser document reloads; modern architectures often pair SSR with HTMX or Turbo for partial page swaps without SPA complexity.
