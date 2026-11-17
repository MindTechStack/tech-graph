---
id: connect-flash
name: "connect-flash (flash messages)"
short: connect-flash
kind: library
status: learned
tags: [connect-flash, flash-messages, express, sessions, notifications]
what: "Express middleware for storing temporary one-time flash notification messages inside user sessions that clear automatically upon read."
why: "Enables the Post/Redirect/Get (PRG) pattern in server-rendered applications, allowing controllers to forward user feedback messages across HTTP redirects."
problem: "Directly rendering views upon POST form failure triggers duplicate submissions on page refresh, while standard HTTP redirects lose request-scoped error messages without session storage."
relations:
  - { to: sessions, label: "stores messages in" }
  - { to: express, label: "middleware for" }
  - { to: cookies, label: "persisted across requests via" }
links:
  - { title: "connect-flash GitHub Repository", url: "https://github.com/jaredhanson/connect-flash" }
  - { title: "Post/Redirect/Get Pattern Explanation", url: "https://en.wikipedia.org/wiki/Post/Redirect/Get" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import session from "express-session";
import flash from "connect-flash";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: false }));
app.use(flash());

// Post route sets a flash message and redirects
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email and password are required.");
    return res.redirect("/login");
  }
  // Proceed with authentication...
});

// Get route consumes and renders the flash message (automatically removed from session)
app.get("/login", (req, res) => {
  const errorMessage = req.flash("error"); // Array of messages, cleared after this call
  res.render("auth/login", {
    errorMessage: errorMessage.length > 0 ? errorMessage[0] : null,
  });
});
```

## Key points
- **Transient Session Lifecycle**: Flash messages are written into `req.session.flash` and automatically deleted as soon as `req.flash(type)` is invoked, ensuring notifications appear exactly once.
- **Post/Redirect/Get (PRG) Flow**: Prevents the browser's dreaded 'Confirm form resubmission' popup on page reload by redirecting with status code 302/303 while preserving notification context.
- **Prerequisite Dependency**: Requires an existing session middleware (`express-session` or `cookie-session`) to be registered earlier in the Express middleware pipeline.
- **Today**: In modern decoupled Single-Page Applications (Vue, React, Svelte) and REST APIs, flash messages are replaced by client-side state stores (Pinia, Zustand) and standard structured JSON error responses.
