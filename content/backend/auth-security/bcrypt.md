---
id: bcrypt
name: "bcrypt (password hashing)"
kind: library
status: learned
tags: [bcrypt, password-hashing, security, cryptography, salts]
what: "Adaptive cryptographic password-hashing function based on the Blowfish cipher with configurable work factor (salt rounds) to resist brute-force attacks."
why: "Provides slow, computationally heavy, one-way password hashing specifically calibrated to make offline dictionary cracking and GPU acceleration infeasible."
problem: "Storing plaintext passwords or using fast general-purpose algorithms (MD5, SHA-256) allows attackers to crack leaked database credentials in seconds using rainbow tables and GPUs."
relations:
  - { to: node-crypto, label: "distinguished from fast hashes in" }
  - { to: sessions, label: "verifies credentials for" }
  - { to: jwt, label: "precedes issuance of" }
  - { to: nodejs, label: "native addon in" }
links:
  - { title: "bcrypt.js GitHub Repository", url: "https://github.com/dcodeIO/bcrypt.js" }
  - { title: "OWASP Password Storage Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" }
alsoIn: []
source: course
---

## Example
```js
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // ~250ms work factor per hash on modern hardware

// 1. Hash password upon registration or password change
async function hashUserPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hash; // e.g. "$2b$12$e8uq4f..." contains algorithm, cost, salt, and hash
}

// 2. Validate password during login
async function verifyUserCredentials(enteredPassword, storedHash) {
  // Constant-time comparison defends against timing attacks
  const isMatch = await bcrypt.compare(enteredPassword, storedHash);
  return isMatch;
}

const hash = await hashUserPassword("super-secret-password-123");
const isValid = await verifyUserCredentials("super-secret-password-123", hash);
console.log("Credentials valid:", isValid);
```

## Key points
- **Self-Contained Salt & Work Factor**: The output string embeds the algorithm identifier (`$2b$`), the cost factor (`$12$`), the 128-bit random salt, and the checksum, requiring no separate salt storage in your database.
- **Adaptive Cost Factor**: Increasing the cost factor by 1 doubles the calculation time; 12 rounds is currently the industry recommended standard (~250-500ms per verification).
- **Constant-Time Verification**: `bcrypt.compare()` compares hashes in constant time to thwart timing attack side-channels that attempt to deduce password length or prefix.
- **Today**: While bcrypt remains battle-tested and widely supported, newer memory-hard algorithms like **Argon2id** (the OWASP top recommendation) offer superior resistance against custom ASIC and GPU cracking hardware.
