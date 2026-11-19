---
id: shadcn-ui
name: "shadcn/ui"
kind: library
status: practiced
tags: [radix-ui, tailwind, copy-paste-components, accessible, headless-ui]
what: "Collection of re-usable, accessible component primitives built on Radix UI and Tailwind CSS that you copy directly into your own codebase."
why: "Gives engineers 100% code ownership and full customization power over component internals without being locked into an external NPM package API."
problem: "Traditional UI component libraries encapsulate styles and markup behind rigid component props, making deep customization or theme divergence frustrating."
relations:
  - { to: tailwind, label: "styled with" }
  - { to: react, label: "built for" }
  - { to: typescript, label: "authored in" }
links:
  - { title: "shadcn/ui Documentation", url: "https://ui.shadcn.com/docs" }
alsoIn: []
source: self-study
---

## Example
```tsx
// components/ui/button.tsx - Copy-pasted component with full code ownership
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
```

## Key points
- **Code ownership over package dependency**: components live directly inside your `src/components/ui/` folder, allowing immediate modification of JSX and classes.
- **Headless accessibility**: builds on top of Radix UI primitives ensuring complete keyboard navigation, focus management, and ARIA attributes out of the box.
- **Class Variance Authority (CVA)**: manages type-safe component variants and compound styling classes cleanly alongside Tailwind.
