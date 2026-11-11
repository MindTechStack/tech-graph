---
id: pagination
name: "Pagination"
kind: concept
status: learned
tags: [pagination, performance, api-design, database, cursor]
what: "Strategy for splitting large database query result sets into discrete, manageable pages or chunks using offset/limit or keyset/cursor approaches."
why: "Prevents server memory spikes, database query timeouts, and slow client rendering by bounding the maximum number of items returned in any single request."
problem: "Returning unbounded query results (SELECT * FROM table) quickly crashes application servers and freezes browsers as datasets grow into tens of thousands of rows."
relations:
  - { to: "rest-api", label: "used in" }
  - { to: "sql", label: "implemented in database queries via" }
links:
  - { title: "API Design: List Pagination", url: "https://cloud.google.com/apis/design/design_patterns#list_pagination" }
  - { title: "PostgreSQL Offset and Limit Guide", url: "https://www.postgresql.org/docs/current/queries-limit.html" }
alsoIn: []
source: course
---

## Example
```js
// Offset-based pagination with pagination metadata
export async function getPaginatedProducts(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  res.json({
    data: rows,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      hasNextPage: page * limit < count,
    },
  });
}
```

## Key points
- **Offset vs Cursor**: offset pagination (`LIMIT / OFFSET`) is easy to implement with page buttons, but scales poorly on deep offsets (`OFFSET 50000`) and can skip or duplicate rows when items are inserted concurrently.
- **Keyset / Cursor pagination**: uses indexed sequential columns (`WHERE id > cursor ORDER BY id LIMIT 20`) for constant $O(1)$ query execution time, ideal for mobile infinite scroll feeds.
- **Enforce strict upper bounds**: always sanitize user-supplied limit parameters (`Math.min(limit, 100)`) to protect the database from malicious unpaginated queries (`?limit=1000000`).
