---
id: sessions
name: "Sessions (express-session)"
kind: concept
status: learned
tags: [sessions, express-session, cookies, authentication, state]
what: "Server-side state pattern where user session data is held on the server and referenced via an opaque, signed cookie ID in the client browser."
why: "Keeps sensitive session state securely on the server, allows instant server-side revocation on logout, and prevents client manipulation of user permissions."
problem: "Storing authentication state or user payloads directly on the client invites tampering, data bloat, and makes instant session termination impossible without a centralized database."
relations:
  - { to: cookies, label: "uses cookie for session id" }
  - { to: express, label: "middleware for" }
  - { to: mongodb, label: "session persistence in" }
  - { to: csrf, label: "requires protection against" }
  - { to: jwt, label: "alternative stateful model to" }
links:
  - { title: "express-session Documentation", url: "https://github.com/expressjs/session" }
  - { title: "connect-mongodb-session Docs", url: "https://github.com/voxpelli/node-connect-mongodb-session" }
alsoIn: []
source: course
---

## Example
```js
import express from "express";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";

const app = express();
const MongoDBStore = ConnectMongoDBSession(session);

// Production store: persists sessions in MongoDB with auto-cleanup (TTL)
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

app.post("/login", (req, res) => {
  req.session.isLoggedIn = true;
  req.session.userId = "user_123";
  req.session.save((err) => {
    if (err) return res.status(500).send("Session error");
    res.redirect("/dashboard");
  });
});
```

## Key points
- **MemoryStore vs MongoDB Store (`connect-mongodb-session`)**: The default `MemoryStore` keeps sessions in Node.js process RAM; it leaks memory, wipes all user logins on server restart, and cannot scale across multiple load-balanced instances. In production, a shared persistent store like `connect-mongodb-session` or Redis is mandatory.
- **Instant Revocation**: Calling `req.session.destroy()` or clearing the session record in the database immediately invalidates user access across all browser tabs, solving a major drawback of stateless tokens.
- **Signed Session Cookie**: The client browser receives only a signed session ID (`connect.sid`), ensuring the raw user object and internal flags (`isAdmin`) remain strictly on the backend.
- **Session Expiry & TTL**: Persistent session stores leverage database TTL (Time-To-Live) indexes to automatically purge expired sessions without manual cleanup cron jobs.
