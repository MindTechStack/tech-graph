---
id: rbac
name: "Role-Based Access Control"
kind: concept
status: work
tags: [rbac, authorization, permissions, security, roles, access-control]
what: "Authorization approach that regulates access to system resources and operations based on assigned user roles and granular permission sets."
why: "Simplifies security administration across teams by mapping permissions to roles (Admin, Editor, Viewer) rather than managing individual user privileges directly."
problem: "Scattering hardcoded permission checks across controller routes creates security vulnerabilities, privilege escalation bugs, and unmaintainable audit surfaces."
relations:
  - { to: express, label: "enforced via middleware in" }
  - { to: sessions, label: "inspects user role from" }
  - { to: jwt, label: "roles embedded in claims of" }
  - { to: better-auth, label: "supported in" }
links:
  - { title: "NIST Role-Based Access Control", url: "https://csrc.nist.gov/projects/role-based-access-control" }
  - { title: "OWASP Authorization Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" }
alsoIn: [frontend]
source: work
---

## Example
```ts
import type { Request, Response, NextFunction } from "express";

type Role = "admin" | "editor" | "viewer";
type Permission = "posts:create" | "posts:edit" | "posts:delete" | "users:manage";

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: ["posts:create", "posts:edit", "posts:delete", "users:manage"],
  editor: ["posts:create", "posts:edit"],
  viewer: [],
};

// Express higher-order authorization middleware
export function requirePermission(requiredPermission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req.user as { role?: Role })?.role;
    if (!userRole) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    const permissions = ROLE_PERMISSIONS[userRole] ?? [];
    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }

    next();
  };
}
```

## Key points
- **Roles vs Permissions**: Prefer checking granular permissions (`can('posts:edit')`) in application code rather than checking role names directly (`if (role === 'editor')`), making role modifications non-breaking.
- **Client UX vs Server Authority**: Client-side frameworks (Vue/React directives and router guards) conditionally hide buttons and views for a polished UX, but authoritative access checks MUST be enforced on the backend API.
- **Hierarchical & Scoped RBAC**: Enterprise applications often introduce role hierarchies (Admin inherits Editor permissions) and tenant scoping (an Org Admin in Tenant A has no privileges in Tenant B).
- **Attribute-Based Access Control (ABAC)**: When rules depend on dynamic context (e.g. 'editors can only edit *their own* draft articles'), RBAC is extended with ownership and resource attribute checks.
