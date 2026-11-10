---
id: scss
name: SCSS / Sass
kind: language
status: work
tags: [css-preprocessor, mixins, variables, build-time]
what: "A CSS preprocessor superset that adds compile-time variables, `@mixin`/`@include`, `@use` modules, functions, and programmatic control flow."
why: "Lets large design systems generate repetitive utility classes, complex media-query helpers, and shared design tokens at build time with zero runtime overhead."
problem: "Before native CSS nesting and custom properties, maintaining thousands of lines of flat CSS led to duplicated selectors, magic values, and global namespace collisions."
relations:
  - { to: css, label: "compiles to" }
  - { to: vite, label: "compiled by" }
links:
  - { title: "Sass Official Documentation", url: https://sass-lang.com/documentation/ }
alsoIn: []
source: work
---

## Example
```scss
// _tokens.scss
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
);

@mixin respond-to($bp) {
  $value: map.get($breakpoints, $bp);
  @media (min-width: $value) {
    @content;
  }
}

// button.scss
@use "sass:map";
@use "tokens" as t;

.btn {
  padding: 0.5rem 0.75rem;
  font-weight: 600;

  @include t.respond-to(md) {
    padding: 0.625rem 1rem;
  }
}
```

## Key points
- **`@use` and `@forward` over `@import`**: modern Dart Sass modules scope variables and mixins behind a namespace (`t.$color`), preventing the global pollution and duplicate CSS output caused by legacy `@import`.
- **Compile-time vs runtime**: Sass variables (`$var`) are erased during build; use CSS custom properties (`--var`) for values that must change dynamically in the browser (themes, runtime state).
- **Prefer `@mixin` over `@extend`**: `@extend` rewrites selector chains across files and can produce unpredictable specificity bugs, whereas `@mixin` outputs explicit, local rules.

