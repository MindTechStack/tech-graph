---
id: react-router
name: React Router
kind: library
status: planned
tags: [routing, react, navigation, loaders, actions]
what: "Standard routing and data-loading library for React web applications."
why: "Coordinates URL routing with declarative nested component routes, parallel data loaders, and form action mutations."
problem: "Client-side navigation without dedicated routing leads to waterfall data fetches, broken URL state, and messy imperative navigation logic."
relations:
  - { to: react, label: "router for" }
  - { to: react-hooks, label: "provides navigation hooks for" }
  - { to: browser-apis, label: "wraps history api of" }
links:
  - { title: "React Router Documentation", url: https://reactrouter.com }
alsoIn: []
source: self-study
---

## Example
```tsx
import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  Outlet,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";

interface User {
  id: string;
  name: string;
}

async function userLoader({ params }: LoaderFunctionArgs): Promise<User> {
  const res = await fetch(`/api/users/${params.userId}`);
  if (!res.ok) throw new Response("User Not Found", { status: 404 });
  return res.json();
}

function UserProfile(): JSX.Element {
  const user = useLoaderData() as User;
  return <h1>Profile: {user.name}</h1>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <nav>Dashboard</nav>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: "users/:userId",
        loader: userLoader,
        element: <UserProfile />,
      },
    ],
  },
]);

export function App(): JSX.Element {
  return <RouterProvider router={router} />;
}
```

## Key points
- **Route loaders eliminate waterfalls**: Data loaders execute in parallel before child components render, fetching data without nested `useEffect` cascades.
- **Nested layout routing**: Parent route layouts remain mounted while nested child routes swap inside `<Outlet />`, preserving scroll and UI state.
- **Form actions and revalidation**: Native HTML form submissions are intercepted by `<Form>`, invoking route actions and automatically revalidating all active loaders.
