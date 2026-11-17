---
id: node-crypto
name: "Node crypto (reset tokens)"
short: Node crypto
kind: library
status: learned
tags: [node-crypto, cryptography, reset-tokens, random-bytes, hashing]
what: "Built-in Node.js cryptographic module providing cryptographically secure pseudo-random number generation (CSPRNG), ciphers, HMAC, and hash functions."
why: "Used to create unguessable password reset tokens, email verification nonces, digital signatures, and session keys without external third-party dependencies."
problem: "Using standard pseudo-random functions like Math.random() produces predictable sequences that allow attackers to anticipate and hijack password reset tokens."
relations:
  - { to: nodejs, label: "built-in module of" }
  - { to: bcrypt, label: "complements for non-password tokens" }
  - { to: jwt, label: "underpins token signing in" }
links:
  - { title: "Node.js Crypto Documentation", url: "https://nodejs.org/api/crypto.html" }
  - { title: "OWASP Forgot Password Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" }
alsoIn: []
source: course
---

## Example
```js
import crypto from "node:crypto";

// 1. Generate unguessable reset token to email to the user
function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex"); // 64 hex characters (256 bits entropy)

  // 2. Hash token with SHA-256 before saving to database (never store raw reset tokens)
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiration

  return { rawToken, hashedToken, expiresAt };
}

// 3. Verify incoming token submitted via reset link
function verifySubmittedToken(submittedRawToken, storedHashedToken, storedExpiresAt) {
  if (Date.now() > storedExpiresAt.getTime()) {
    return { valid: false, reason: "Token expired" };
  }

  const incomingHash = crypto.createHash("sha256").update(submittedRawToken).digest("hex");
  // Use timingSafeEqual to avoid timing side-channels
  const match = crypto.timingSafeEqual(
    Buffer.from(incomingHash, "hex"),
    Buffer.from(storedHashedToken, "hex"),
  );

  return { valid: match };
}
```

## Key points
- **CSPRNG via `randomBytes`**: `crypto.randomBytes()` sources entropy from the operating system's cryptographic random pool (`/dev/urandom` or CryptGenRandom), guaranteeing statistically unpredictable values.
- **Hash Before Persistence**: Just like passwords, raw password reset tokens sent via email should be hashed (using fast SHA-256) before saving in the database; if the database leaks, reset tokens cannot be abused.
- **Single-Use & Strict Expiration**: Reset tokens must be strictly time-limited (15-60 minutes) and invalidated immediately once consumed or upon any password change.
- **`crypto.timingSafeEqual()`**: When comparing sensitive cryptographic hashes or signatures, always use `timingSafeEqual` rather than `===` to prevent timing attacks.
