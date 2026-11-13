---
id: react-hook-form
name: React Hook Form
kind: library
status: planned
tags: [forms, react, validation, uncontrolled-inputs, hooks]
what: "React forms library built on uncontrolled inputs and refs, so typing does not re-render the whole form."
why: "Minimizes component re-renders by embracing uncontrolled DOM inputs while providing schema validation and seamless DX."
problem: "Controlled React form inputs trigger re-renders on every keystroke across parent forms, degrading input responsiveness on large forms."
relations:
  - { to: react, label: "form library for" }
  - { to: react-hooks, label: "uses hooks in" }
  - { to: vuelidate, label: "frontend form validation counterpart to" }
links:
  - { title: "React Hook Form Documentation", url: https://react-hook-form.com }
alsoIn: []
source: self-study
---

## Example
```tsx
import { useForm, type SubmitHandler } from "react-hook-form";

interface FormInputs {
  email: string;
  age: number;
}

export function RegistrationForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log("Submitted data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
        />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="number"
          {...register("age", {
            valueAsNumber: true,
            min: { value: 18, message: "Must be 18 or older" },
          })}
          placeholder="Age"
        />
        {errors.age && <p role="alert">{errors.age.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>Register</button>
    </form>
  );
}
```

## Key points
- **Uncontrolled input performance**: Registers inputs via native `ref` attributes, allowing the browser to manage DOM state without re-rendering the whole form component on keystrokes.
- **Standard schema validation**: Integrates with schema validators (Zod, Yup, Valibot) via `@hookform/resolvers` for robust type-safe validation contracts.
- **Controlled UI kit bridge**: Complex custom components (e.g. rich text, custom selects) easily integrate using the `<Controller />` component or `useController` hook.
