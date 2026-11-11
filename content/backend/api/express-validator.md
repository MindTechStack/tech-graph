---
id: express-validator
name: "express-validator (validation & sanitization)"
kind: library
status: learned
tags: [validation, sanitization, express, middleware, security]
what: "Express middleware library built on validator.js for validating and sanitizing incoming HTTP request bodies, parameters, queries, and headers."
why: "Protects application business logic and databases from malformed payloads, injection attacks, and inconsistent data types before route handlers execute."
problem: "Without input validation, unexpected data types cause unhandled runtime exceptions, and unsanitized strings expose the application to XSS and injection vulnerabilities."
relations:
  - { to: "express", label: "validation middleware for" }
  - { to: "error-handling", label: "forwards validation errors to" }
links:
  - { title: "express-validator Official Docs", url: "https://express-validator.github.io/docs/" }
  - { title: "validator.js GitHub Repository", url: "https://github.com/validatorjs/validator.js" }
alsoIn: []
source: course
---

## Example
```js
import { body, validationResult } from "express-validator";

export const createUserValidators = [
  body("email")
    .isEmail().withMessage("Must provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .trim(),
  body("age")
    .optional()
    .isInt({ min: 18 }).withMessage("Must be at least 18 years old")
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
```

## Key points
- **Validation vs Sanitization**: validation verifies payload rules (`isEmail`, `isUUID`, `isNumeric`); sanitization normalizes input into clean types (`normalizeEmail`, `trim`, `toInt`).
- **Validation error aggregation**: `validationResult(req)` collects all accumulated field errors; checking `errors.isEmpty()` allows returning a detailed 422 Unprocessable Entity report.
- **Custom async validation**: `.custom(async (value) => ...)` enables database-backed uniqueness checks (e.g. verifying an email is not already registered before proceeding).
