---
id: ant-design
name: "Ant Design"
kind: library
status: work
tags: [ui-kit, enterprise-ui, react-components, form-controls, design-system]
what: "React design system and component library aimed at admin and data-heavy apps, with tables and complex form controls."
why: "Accelerates internal tools and enterprise dashboard development with battle-tested tables, date pickers, trees, and accessible layout primitives."
problem: "Building complex enterprise UI widgets like editable data grids, tree selects, and multi-step forms from scratch requires months of developer time."
relations:
  - { to: react, label: "built for" }
  - { to: typescript, label: "written in" }
links:
  - { title: "Ant Design Documentation", url: "https://ant.design/docs/react/introduce" }
alsoIn: []
source: work
---

## Example
```tsx
import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface NodeRecord {
  key: string;
  id: string;
  status: "work" | "planned";
  category: string;
}

const columns: ColumnsType<NodeRecord> = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Category", dataIndex: "category", key: "category" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={status === "work" ? "blue" : "default"}>{status.toUpperCase()}</Tag>
    ),
  },
];
```

## Key points
- **Enterprise feature depth**: provides out-of-the-box sorting, filtering, row selection, pagination, and virtualized scrolling for large datasets.
- **Theme customization**: modern Ant Design v5 uses CSS-in-JS design tokens (`ConfigProvider`) for dynamic runtime theming without Less compilation.
- **Bundle overhead**: due to extensive feature sets and icons, tree-shaking and dynamic imports are essential to prevent large production bundles.
