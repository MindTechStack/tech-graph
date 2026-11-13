---
name: Tech Graph
description: A Swiss-grid register of what one developer knows, where the graph is the index plate and every node is a ruled entry.
colors:
  paper: "#f6f6f3"
  paper-sunk: "#ecece8"
  ink: "#111111"
  ink-2: "#5c5c58"
  ink-muted: "#63635d"
  hairline: "#d6d6d1"
  rule: "#111111"
  grid-line: "rgba(17, 17, 17, 0.05)"
  accent: "#1f3bd6"
  accent-wash: "rgba(31, 59, 214, 0.08)"
  on-accent: "#ffffff"
  on-ink: "#f6f6f3"
  error: "#c4271b"
  status-work-fill: "#111111"
  status-practiced-fill: "#5c5c58"
  status-learned-fill: "#f6f6f3"
  status-learning-fill: "#f6f6f3"
  status-planned-fill: "#f6f6f3"
typography:
  display:
    fontFamily: '"Host Grotesk Variable", "Helvetica Neue", Arial, sans-serif'
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Host Grotesk Variable", "Helvetica Neue", Arial, sans-serif'
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "24px"
    letterSpacing: "-0.015em"
  name:
    fontFamily: '"Host Grotesk Variable", "Helvetica Neue", Arial, sans-serif'
    fontSize: "15px"
    fontWeight: 600
    lineHeight: "20px"
    letterSpacing: "-0.01em"
  prose:
    fontFamily: '"Host Grotesk Variable", "Helvetica Neue", Arial, sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "24px"
  control:
    fontFamily: '"Host Grotesk Variable", "Helvetica Neue", Arial, sans-serif'
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "16px"
  label:
    fontFamily: '"Host Grotesk Variable", "Helvetica Neue", Arial, sans-serif'
    fontSize: "13px"
    fontWeight: 600
    lineHeight: "20px"
  mono:
    fontFamily: '"Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  mono-code:
    fontFamily: '"Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: "20px"
  mono-sm:
    fontFamily: '"Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  none: "0px"
spacing:
  baseline: "4px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
grid:
  module: "80px"
  column: "64px"
  gutter: "16px"
components:
  author-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "32px"
    padding: "0 16px"
  author-bar-resume:
    textColor: "{colors.accent}"
    typography: "{typography.control}"
  toolbar:
    backgroundColor: "{colors.paper}"
    height: "48px"
  map-tab:
    textColor: "{colors.ink-2}"
    typography: "{typography.control}"
  map-tab-active:
    textColor: "{colors.ink}"
    underline: "2px {colors.accent}"
  view-toggle-active:
    textColor: "{colors.ink}"
    underline: "2px {colors.ink}"
  sidebar:
    backgroundColor: "{colors.paper}"
    width: "240px"
  detail-panel:
    backgroundColor: "{colors.paper}"
    width: "464px"
  filter-row-active:
    textColor: "{colors.accent}"
    leftRule: "2px {colors.accent}"
  status-legend-row:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    height: "44px"
  relation-row:
    typography: "{typography.control}"
    divider: "1px {colors.hairline}"
  tech-node:
    width: "224px"
    height: "64px"
    rounded: "{rounded.none}"
  code-block:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-code}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  modal-search:
    backgroundColor: "{colors.paper}"
    width: "624px"
    frame: "1px {colors.rule}"
---

# Design System: Tech Graph

## Overview

**Creative North Star: "The Ruled Register"**

Tech Graph is laid out like a Swiss technical register: a printed sheet of entries on a module grid, ruled with hairlines and set in one grotesque, with a monospace face for identifiers. The canvas is the register's index plate, showing every entry as a block on the grid, filled with as much ink as the author has earned. The detail panel is the entry itself, a ruled information sheet with a hanging label column on the left and the text in the column beside it.

The mood is exact, plain and confident. Hierarchy comes from size, weight, position and rule weight, never from boxes or tone. Colour is rationed: black ink on white paper, one ultramarine accent for *where you are and what you picked*, and the twelve atlas tints for *which category a node belongs to*. Everything else is ink.

The register is still dense, because a laptop must hold a whole map. It gets there through alignment rather than shrinking: every pane, node and row snaps to the same 4px baseline and 80px module, so a dense screen still reads as one calm sheet.

**Key characteristics:**
- Light paper only. One ground, with no tonal stacking of panes.
- Sections are separated by hairlines and whitespace, never by cards, fills or shadows.
- Status is shown by the amount of ink, not by hue: solid, grey, outlined, ticked, dashed.
- Category is the only other colour, as flat atlas-tint fields and bands.
- Square corners everywhere. Nothing floats on a shadow.
- Mono marks identifiers: relation verbs, ids, kinds, status values, tags, counts and code.

## Anti-reference: "The Annotated Map"

The previous system, an annotated map in navy, is what this one replaces. When a decision feels familiar, check it against this list. Anything here is out of bounds:

- **Dark navy ground with four tonal steps** (Margin, Panel, Card, Raised Navy), where depth meant "a slightly lighter navy box".
- **Cards inside panels.** Trio cards, relation rows, link rows and error items each sat in their own rounded, bordered box on a different navy. Every section was a container.
- **Soft corners at every scale** (4/6/7/8/9/10/12/14px and pills) and the "soft and tactile, a little friendly" register.
- **Five vivid status hues** (blue, violet, green, amber, slate) as borders, pill badges and dots, with the accent blue sharing a hex with `work`.
- **Washes as state.** Translucent blue fills behind active chips, rows, tags and search results.
- **Floating depth.** Shadows on every node, a lift on hover, a shadow on the panel's edge, blurred translucent overlays over the canvas.
- **Emoji kind icons and an emoji logo.**
- **Pill badges and chips** for status, tags, counts and maps.
- **Uppercase muted section labels** as the only structure inside a panel.
- **A dot grid** as canvas texture.

What survives from the old system is product truth, not look: the five statuses, the category atlas order, ghost nodes, the dashed-means-distance idea, the far view, the phone reading layout and every interaction.

## Colors

Colour strategy: **Restrained.** Ink on paper, one accent, and a content-owned category palette.

### Ground and ink
- **Paper** (`paper`, `#f6f6f3`): the only ground. Toolbar, sidebar, canvas, detail panel and modals all sit on it. Panes are told apart by hairlines and position, not by tone.
- **Paper Sunk** (`paper-sunk`): the code field, and the only area filled differently from the page. It is a field, not a box: no border, no corners.
- **Ink** (`ink`, `#111111`, 17:1 on paper): text, heavy rules and the `work` fill.
- **Ink 2** (`ink-2`, 6.2:1): secondary text and the `practiced` fill (white text on it is 6.7:1).
- **Ink Muted** (`ink-muted`, ≈5.5:1): metadata, counts, relation verbs and placeholders. Never lighter than this for text.
- **Hairline** (`hairline`): the 1px rule between rows, sections and panes.
- **Rule** (`rule`, ink): the 2px rule that opens a major section, and the frame of a modal.
- **Grid Line** (`grid-line`): the module grid drawn on the canvas, at 5% ink.

### Accent: Signal Ultramarine
- **Accent** (`accent`, `#1f3bd6`, 7.3:1 on paper, 7.9:1 for white on it): the one saturated colour. It marks *place and selection*: the active map tab underline, active filter rows, the selected node's outline, the selected node's edges, the focus ring, the active search result, links, and the primary action.
- **Accent Wash** (`accent-wash`, 8%): only behind the keyboard-active search result. Nowhere else.
- **One sanctioned non-interactive use:** the `learning` tick on a node (see Status). It differs from selection by shape, a short solid bar against a full outline, and it is the only time the accent states a fact.

### Status: the ink density ramp
Status is the amount of ink a node carries. It is never shown by hue:

| Status | Node fill | Text | Edge |
|---|---|---|---|
| `work` | Ink | Paper | none |
| `practiced` | Ink 2 | White | none |
| `learned` | Paper | Ink | 1px ink |
| `learning` | Paper | Ink | 1px ink + 4px accent tick on the right edge |
| `planned` | Paper | Ink 2 | 1px dashed Ink Muted |

Every node and every list row also carries the status as its literal mono value (`work`, `learned`…), so status never depends on fill alone. Legend swatches and the progress bar use the same five treatments as the nodes.

### Category: atlas tints (content-owned, unchanged)
Category colours stay in `content/maps.yaml` as the twelve atlas tints (OKLCH L 0.82 / C 0.065 and L 0.74 / C 0.075, at 30° hue steps): Rose `#ebb4b7`, Clay `#d49c84`, Sand `#ddbf95`, Olive `#b1ae76`, Moss `#b2cea4`, Sage `#7dba9f`, Seafoam `#92d2d1`, Glacier `#75b5cf`, Dusk `#a8c7ee`, Lavender `#a5a5d9`, Mauve `#d4b8e2`, Heather `#ce98b6`. The assignment rules hold: no two categories in a map share a tint, categories that sit next to each other in order never take neighbouring tints, and a new category picks one of the twelve.

On paper the tints are only 1.6–2.1:1, so they become **fields, never ink**:
- the 6px band down a node's left edge (8–10:1 against an ink node);
- the Layers-mode group region, a flat tint field at about 30% alpha;
- the 8px square swatch beside a category name in the sidebar, legend and card;
- the per-category mini progress bar.

A category name is always set in ink beside its swatch. Tint text and tint outlines are never used.

### Feedback
- **Error** (`error`, `#c4271b`): validation errors only, in the error panel, on the toolbar's validation count and in error rows. It is a system state, not a second accent.
- Warnings and a clean result are ink with a mono count (`3 warnings`, `0 issues`). Amber and green are retired.
- All of this is **author tooling and exists only in development builds**. A production visitor never sees a validation count, the error panel or the error banner, so the error red never reaches them. Content problems are caught by `npm run validate` before deploy, not shown to readers.

### Code
The code is monochrome with one accent: keywords in ink at 600 weight, strings and numbers in accent, functions and everything else in ink, and comments in Ink Muted.

### Named Rules
**The One Accent Rule.** Ultramarine means "here" or "chosen". If a second saturated hue appears outside the error state, something has drifted.

**The Ink-Is-Experience Rule.** The more ink a node carries, the deeper the author's experience. Never fill a node for emphasis, decoration or hover.

**The Tint-Is-Territory Rule.** Atlas tints are fields that say "this belongs to category X". They are never text, lines, status or state.

**The Dashed-Means-Distance Rule** (kept). A dashed line means not yours yet (`planned`) or living on another map (ghost node or ghost group). Nothing else is dashed.

## Typography

**Grotesque:** Host Grotesk (variable, self-hosted via `@fontsource-variable/host-grotesk`), falling back to Helvetica Neue and Arial.
**Mono:** Geist Mono (variable, self-hosted via `@fontsource-variable/geist-mono`), falling back to the system mono stack.

**Character:** a neutral grotesque carries every name, sentence and control. The mono is the voice of the data model: anything that is a literal value in the Markdown frontmatter (an id, a relation verb, a kind, a status, a tag) or that you would type (code, a shortcut) is set in mono. Hierarchy comes from size and weight only. Colour is never used for type hierarchy.

### Scale (desktop; every line height a multiple of the 4px baseline)
- **Display** (700, 32/36, −0.025em): the node name at the top of the entry. Flush left, wraps, never truncates.
- **Title** (600, 20/24, −0.015em): modal titles and the map name in the sidebar head.
- **Name** (600, 15/20, −0.01em): node names on the canvas and in search results. Truncates with an ellipsis on the canvas.
- **Prose** (400, 15/24): what / why / problem, the Markdown body and key points. In the entry's content column, lines run about 55–62 characters.
- **Control** (500, 13/16): tabs, toggles, filter rows, relation names, buttons.
- **Label** (600, 13/20, sentence case): the hanging-column labels ("What", "Why", "Problem", "Example", "Connections") and sidebar section heads. Labels are not uppercase and not tracked.
- **Mono** (400, 12/16): relation verbs, ids, kinds, status values, tags, counts and kbd hints. Counts use tabular figures.
- **Mono Code** (400, 12.5/20): code blocks and inline code.
- **Mono Small** (400, 11/16): the kind · status line on a canvas node and edge labels.

**Phone reading scale** (phone layout only): Display 28/32, Prose 17/28, Control and relation rows 16/24, Mono 13/20, code 13.5/20. The search input is 16px on every touch device.

### Named Rules
**The Mono-for-Values Rule.** If it appears literally in a node's frontmatter or could be typed (`built on`, `nestjs`, `framework`, `learning`, `#orm`, Ctrl K), it is mono. Names and sentences never are.

**The No-Shouting Rule.** Nothing is uppercase or letter-spaced. Hierarchy is size, weight and position.

## Layout

### The grid
- **Baseline:** 4px. Every line height, padding and gap is a multiple of 4.
- **Module:** an 80px pitch, made of a 64px column and a 16px gutter. Pane widths, node sizes and canvas spacing are whole modules.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48. Inside a row use 4–12, between rows 0 (a hairline does the work), and between sections 24 or 32 plus a rule.

### Workspace
A full-viewport sheet with no page scroll:
- **Author bar:** 32px, one row above the toolbar, with a hairline underneath. It says whose register this is: the author's name, their role, and a link to the résumé PDF flush right. It is the only line on the sheet that speaks about a person rather than the map.
- **Toolbar:** 48px, one row, with a hairline underneath. Wordmark "Tech Graph" (Name size, 700) at the left, with its mono counts beside it only above 1600px. Then the map tabs, which scroll in their own strip and fade out at its right end rather than pushing the controls. On the right: search (its `Ctrl K` hint hides at 1360px and below), the Layers/Network toggle, the edge-label toggle (moved into the sidebar at 1024px and below) and, in development builds only, the validation count. The status legend lives in the sidebar, not the toolbar.
- **Sidebar:** 3 modules (240px), on the left, with a hairline on its right edge.
- **Canvas:** fills the space between the panes. Paper with the module grid drawn in Grid Line.
- **Detail panel (the entry):** 6 modules (464px), on the right, with a hairline on its left edge. At 1360px and below it is 5 modules (384px) and the sidebar stays 240px.
- At 1024px and below the panes overlay the canvas, separated from it by a 1px Rule line instead of a shadow. The sidebar starts closed.

### The entry (detail panel)
The panel is laid out on two columns: a **hanging column** of 1 module (64px) for labels, a 16px gutter, and a **content column** for everything else.
- **Head:** the Display name first, with the centre and close buttons at its right. Then the category swatch, category name and map link on one line. Then the status line: the status swatch, the mono value `learned` in Ink, and its definition in Ink Muted at Control size (`learned · completed in a course`). Then a mono line `framework · nestjs`. A 2px Rule closes the head. Nothing sits above the name: a mono line over a heading reads as an eyebrow and is not used.
- **Body sections**, in order: What, Why, Problem, Example, Key points, Connections, Links, Tags. Each section is a row: its label sits in the hanging column on the first baseline of its content, and a full-width hairline sits above it. There are no boxes and no stripes.
- **Example:** the code field spans the content column and bleeds to the panel's right edge.
- **Connections:** a ruled table. Each row has three columns: a mono verb in Ink Muted, the name at Control size, then the map (mono, only when it differs from the current map). Outgoing rows read "verb → name" and backlinks read "name ← verb". There is a hairline between rows. The first six rows of each direction are shown, and the rest sit behind a native `<details>` ("6 more", mono).
- **Tags:** inline mono words (`#orm #sql`), separated by spaces. No chips.

### The canvas
- Nodes are **224 × 64**, so a node plus its gutter fills exactly 3 × 1 modules. ELK spacing is set in multiples of 16, so in Layers mode nodes sit on the grid at 100% zoom.
- **Focus camera:** opening a node by deep link, search or a relation fits the node plus as many of its nearest neighbours as fit at 75% zoom or closer, inside the canvas area the entry leaves visible. The camera never drops into the far view to fit more; neighbours that do not fit stay off-screen, and their highlighted edges lead toward them.
- **Layers mode:** category groups are flat tint fields packed in `maps.yaml` order. Each group has a header line inside the field, flush left: the category name in ink at Control 600 and a mono count. There is no outline and no corner radius. Ghost groups have no fill and a 1px dashed Ink Muted outline, and are titled "↗ <map name>".
- **Network mode:** the same nodes float free over the grid.
- **Far view** (below 75% zoom): nodes show the name only, at 26 canvas px. The ink density ramp keeps status readable at that distance. Group titles grow to 26px and the counts hide.
- Overlays on the canvas (the info line, the empty state) are paper blocks with a 1px Rule frame. They are opaque, unblurred and have no shadow.

### Search and error panel
Both are **sheets**, top-aligned at 9vh, on a backdrop of paper at 80% with no blur. Search is 624px wide (8 modules − 16), the error panel 704px. Both have a 1px Rule frame and no shadow. A search result is a ruled row: the name (Name size), its `what` in Prose 13/20 in Ink 2, then a mono line `map · kind · status` led by the status swatch and followed by the tags. The keyboard-active row gets Accent Wash and a 2px accent rule on its left.

### Phones
The reading layout is kept. The entry takes the full screen and the hanging column collapses: each label sits above its content and the hairlines remain. Content is capped at 680px. The author bar keeps its hairline and wraps to two lines: the name with the résumé link flush right, then the role beneath. It takes the top safe-area inset, so the toolbar below it does not. The toolbar keeps two rows (filters button, wordmark, a `Map` toggle and search, then a swipeable map-tab strip); the wordmark's mono counts are dropped, since the tabs carry them. Touch devices get 44px hit areas on rows and buttons.

**Phone index.** At phone width the canvas is replaced by a ruled index of the current map. It opens with a status key: a `<details>` row whose closed summary is the five swatches with their mono values and whose open state lists each definition. Below it are category groups in `maps.yaml` order. Each group has a sticky head (tint swatch, category name at Label 15/24, mono count) closed by a 2px Rule, and its nodes sort by name. Each node is the search-result row (`NodeRowContent`) without the map and tags: the name, its `what` clamped to two lines, then the status swatch with `kind · status`. Sidebar filters apply to the index. On cross-map scopes, and for `alsoIn` nodes, a group head reads `Map · Category`. The `Map` toggle (`aria-pressed`, marked with a 2px ink underline inside its frame) swaps the index for the graph.

## Elevation & Depth

None. The sheet is flat. Depth is said by position (an overlay sits on top) and by a 1px Rule frame. There are no shadows, no lifts and no blurred overlays.

**The Flat Sheet Rule.** If something needs to read as "on top", give it a Rule frame and an opaque paper fill. Never use a shadow.

## Shapes

Every corner is square, and there are no circles: status, category and legend marks are squares, and so are focus rings. Line weights carry meaning:
- 1px Hairline: rows, sections, pane edges.
- 1px Ink: `learned` and `learning` node edges, toggles.
- 1px dashed Ink Muted: `planned` nodes, ghosts.
- 2px Rule: the close of the entry head, major section breaks, modal frames.
- 2px Accent: selection, the active tab underline, the active filter rule, focus.
- 4px Accent: the `learning` tick.
- 6px tint: the category band on a node.

## Components

### Buttons and toggles
- **Default button:** text at Control size in ink on paper, with a 1px ink frame and 4px × 12px padding. On hover the frame and text turn accent.
- **Primary:** an accent fill with white text and no frame. Used once per context at most (for example "Reset filters" in the empty state).
- **Icon / close:** borderless. On hover the glyph turns accent.
- **Map tabs:** plain text with a mono count. The active tab is ink text with a 2px accent underline flush with the toolbar's bottom hairline.
- **Grouped / Free** (the `layers` and `network` layout modes): two words separated by a hairline. The active word is ink with a 2px **ink** underline (a view setting, not a place, so it is not accent).
- **Validation count:** mono text. Ink when clean or only warnings, Error red with errors. Rendered in development builds only; production omits it entirely rather than hiding it.
- **Transitions:** colour and opacity only, 120ms ease-out. Nothing moves.

### Author bar
The register's colophon: plain, set flush left on the sheet, never a banner.
- **Name:** Label (600, 13/20) in Ink.
- **Role:** Control size in Ink 2, copied verbatim from the résumé headline. Never paraphrased into a bigger claim.
- **Résumé link:** Control size in Accent, underlined 1px at a 3px offset, flush right, opening the PDF in a new tab. A mono-small `PDF` in Ink Muted follows the word so the format is stated, not guessed. On hover the text turns Ink. On touch devices the hit area grows to 44px tall through padding the bar absorbs, so the bar stays 32px.
- Nothing else lives here: no avatar, no photo, no contact icons, no availability badge.

### Sidebar
The head is the current map name at Title size, with Reset (only when filters are active) and a collapse glyph. Sections in order: Status (the legend is now a filter), Categories, Kinds, View (compact widths only), Progress. They are separated by hairlines and 24px of space, and each has a sentence-case Label head.
- **Filter row:** a 32px row with a swatch (the status ramp square or the category tint square), the name at Control size, and a right-aligned tabular mono count. Hover turns the name accent. Active means accent text plus a 2px accent rule at the row's left edge. A row with a zero count is disabled and has no hover: its swatch, count and bar drop to 40% opacity and its name turns Ink Muted, but a status definition stays at full Ink Muted so the legend still reads.
- **Status legend rows:** the Status section is also the legend, so each of its rows defines its status. A status row is 44px: the swatch, the status name at Control size, and beneath it a one-line definition in the grotesque at 12/16 (400) in Ink Muted, then the mono count. The definitions are fixed and honest: `work` Used in commercial projects, `practiced` Built in personal projects, `learned` Completed in a course, `learning` Studying now, open questions, `planned` Next on the study list. Wherever a status mark appears without room for its definition, the definition rides along as the element's title.
- **Category rows** wrap a long name to a second line instead of truncating it. On cross-map scopes the name reads `Frontend · Languages & Platform`.
- **Kinds:** rows, not chips. The kind value is set in mono (`framework`). The ghost-node checkbox, labelled "Show linked nodes from other maps", sits under them.
- **View** (1024px and below, where the toolbar drops these controls): an "Always show edge labels" row, plus "Grouped by category" and "Free layout" rows at phone width. Same filter-row styling; active is accent.
- **Progress:** a 4px bar on a hairline track, divided by the five status treatments (ink, ink-2, outlined, ticked, dashed), with a plain breakdown beneath: a mono count plus a phrase per non-empty status (`48 at work`, `7 in projects`, `61 from a course`, `8 learning now`, `9 planned`). No percentage or "done" total: it would count a course as equal to commercial use. Per-category bars are the same 4px status split under each category row, whose count is a plain total (`14`, never `14/14`); the row's swatch carries the category tint.

### Tech Node (signature)
A 224 × 64 block with square corners. The fill and edge follow the ink density ramp, and a 6px category band runs down the left edge.
- **Line 1:** the name at Name size, truncated with an ellipsis.
- **Line 2:** mono small `kind · status` (for example `framework · work`), one step quieter than the name and never below 4.5:1: Ink Muted on paper nodes, 70% Paper on `work`, 85% white on `practiced`.
- **Hover:** a 1px accent outline at a 2px offset.
- **Selected:** a 2px accent outline at a 2px offset. The node's own fill never changes. While a node is selected or hovered, it and its neighbours lift above the edge layer, so no relation line crosses a name.
- **Ghost:** a paper fill, a 1px dashed Ink Muted edge, and line 2 reads `↗ backend`.
- **Dimmed:** 20% opacity over 120ms.
- **Focus-visible:** the same 2px accent outline at a 4px offset (8px wide in the far view). Enter or Space opens the entry.
- Connection handles are hidden until hover.

### Edges
Straight or orthogonal 1px ink lines at 30% opacity. They drop to 10% when dimmed. The selected node's relations become 2px accent lines at 100%. Edge labels are Mono Small on an opaque paper plate with no frame. A hovered edge always shows its label. On selection, a relation's label shows only when the selected node has six relations or fewer and the plate clears every node box and every plate already placed; anything else waits for hover, because the Connections table lists every relation anyway. The toggle shows all labels. Edges are never dashed and never animated.

### Inputs
- **Search field:** borderless inside the sheet's head, at Title size. Keyboard hints (`↑ ↓`, `Enter`, `Esc`) live only in the sheet's footer. A 2px Rule sits under the field. A query starting with `#` matches tags only.
- **Checkboxes:** native, with `accent-color: accent`.

### Inline code
Mono Code in ink on Paper Sunk, padded 0 × 4px, with square corners. Backticks in frontmatter text render as inline code.

### Icons
There are none. Emoji are removed: a kind is its mono value, and the logo is the wordmark. If an icon is ever added, it is a 1.5px-stroke square-capped line glyph at 16px, drawn in ink.

## Do's and Don'ts

### Do:
- **Do** align every pane, node and row to the 4px baseline and the 80px module.
- **Do** separate sections with a hairline and 24–32px of space, and open major sections with a 2px Rule.
- **Do** show status with the ink density ramp *and* the literal mono value, together.
- **Do** use atlas tints only as fields: node bands, group regions, swatches and category progress bars.
- **Do** keep the accent for place, selection, focus, links, the primary action and the `learning` tick.
- **Do** set every frontmatter value (ids, verbs, kinds, statuses, tags) in Geist Mono.
- **Do** make every transition colour or opacity only, 120ms, and instant under `prefers-reduced-motion`.
- **Do** define every status in words where it is shown as a legend; ink density alone is not a definition.
- **Do** gate author tooling (validation count, error panel, error banner) behind development builds.

### Don't:
- **Don't** put a section, relation, link or error item in a card, a tinted box or a bordered container (see the Anti-reference).
- **Don't** round a corner, cast a shadow, lift on hover or blur a backdrop.
- **Don't** add a second saturated hue. Error red is the only exception, and only for validation errors.
- **Don't** fill a node for any reason other than its status.
- **Don't** use a tint as text, as an outline or for a status.
- **Don't** uppercase or letter-space anything.
- **Don't** use emoji or pill badges, or chips for tags, kinds or statuses.
- **Don't** hard-code category colours in CSS. They live in `content/maps.yaml`.
- **Don't** let the author bar grow into a hero, a card or a contact block. It is one 32px line.
- **Don't** put a mono line, kicker or eyebrow above a heading or a node name. The name leads; values follow.
- **Don't** let an edge label sit on a node title. If it cannot clear every node, it waits for hover.
