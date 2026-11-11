---
id: tanstack-query
name: TanStack Query
kind: library
status: planned
tags: [async-state, data-fetching, cache, server-state, react]
what: "Powerful asynchronous server-state management, caching, and synchronization library for web frameworks."
why: "Automates caching, background revalidation, request deduplication, and optimistic updates for server data."
problem: "Storing server responses in global client stores like Redux or Pinia leads to stale data bugs, manual cache tracking, and duplicated loading states."
relations:
  - { to: react, label: "used with" }
  - { to: fetch-api, label: "wraps requests from" }
  - { to: axios, label: "executes queries with" }
  - { to: zustand, label: "separates server state from" }
links:
  - { title: "TanStack Query Documentation", url: https://tanstack.com/query/latest }
alsoIn: []
source: self-study
---

## Example
```tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export function TodoList(): JSX.Element {
  const queryClient = useQueryClient();

  const { data: todos, isLoading, error } = useQuery<readonly Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to load todos");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const mutation = useMutation({
    mutationFn: async (newTodo: { title: string }) => {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <button onClick={() => mutation.mutate({ title: "New Task" })}>Add Todo</button>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Key points
- **Server state vs client state**: Server state is asynchronous, cached, and owned by remote APIs; Query treats remote data as an auto-expiring cache rather than client UI state.
- **Automatic revalidation**: Queries automatically refetch on window focus, network reconnection, or component remount to guarantee fresh data.
- **Query keys as cache identifiers**: Hierarchical array query keys (`['todos', filter]`) drive cache granularity, targeted invalidation, and optimistic updates.
