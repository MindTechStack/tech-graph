---
id: redux-toolkit
name: Redux Toolkit
kind: library
status: planned
tags: [redux, state-management, react, slices, typescript]
what: "Official package for writing Redux: slices, an Immer-based reducer helper, store setup and RTK Query."
why: "Eliminates traditional Redux boilerplate through createSlice, built-in Immer immutable updates, and pre-configured store setups."
problem: "Original vanilla Redux required verbose action types, action creators, handwritten immutable reducers, and manual middleware configuration."
relations:
  - { to: react, label: "state architecture for" }
  - { to: react-hooks, label: "accessed via useSelector and useDispatch in" }
  - { to: zustand, label: "compared with" }
links:
  - { title: "Redux Toolkit Documentation", url: https://redux-toolkit.js.org }
alsoIn: []
source: self-study
---

## Example
```ts
import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      // Immer allows direct mutations
      state.value += 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, incrementByAmount } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Key points
- **Immer-powered mutations**: Reducers in `createSlice` safely allow mutative syntax (e.g. `state.value += 1`) while Immer generates fresh immutable state trees underneath.
- **Standardized slice structure**: Slices bundle action creators and reducer logic into a single cohesive module, eliminating disparate action creator files.
- **RTK Query inclusion**: RTK packages a complete data fetching and caching solution (RTK Query) directly alongside core Redux state management.
