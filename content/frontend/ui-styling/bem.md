---
id: bem
name: "BEM methodology"
kind: concept
status: work
tags: [css-architecture, naming-convention, modular-css, maintainability, specificity]
what: "Modular naming methodology that structures CSS into Blocks, Elements, and Modifiers to create clear, self-documenting styling rules."
why: "Eliminates CSS specificity wars and cascading side-effects by keeping all style selectors strictly flat with single-class specificity."
problem: "Unstructured CSS leads to deeply nested descendant selectors, unpredictable overrides, and fear of touching legacy stylesheets."
relations:
  - { to: css, label: "organizes" }
  - { to: scss, label: "authored with" }
links:
  - { title: "BEM Methodology Guide", url: "https://en.bem.info/methodology/quick-start/" }
alsoIn: []
source: work
---

## Example
```scss
// SCSS implementation of BEM naming conventions
.user-card {
  display: flex;
  padding: 1.5rem;
  border-radius: 8px;

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  &__content {
    margin-left: 1rem;
  }

  &--highlighted {
    border: 2px solid #3b82f6;
    background-color: #f0f9ff;
  }
}
```

## Key points
- **Block-Element-Modifier syntax**: `.block__element--modifier` immediately conveys component hierarchy and variant intent in HTML.
- **Flat specificity tree**: relying entirely on single class names avoids `!important` hacks and deep `.nav > ul > li > a` selector chains.
- **Component encapsulation**: independent block namespaces ensure that styling changes in one widget never accidentally corrupt another.
