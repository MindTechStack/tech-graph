---
name: Tech Graph
description: A personal knowledge map where the graph is the map and every card is a margin note.
colors:
  margin-navy: "#0b0e14"
  panel-navy: "#131722"
  card-navy: "#161b28"
  raised-navy: "#1a2030"
  node-surface: "#141925"
  code-well: "#0a0d14"
  border-navy: "#262e42"
  border-strong: "#3b4764"
  border-subtle: "rgba(148, 163, 184, 0.14)"
  slate-wash: "rgba(148, 163, 184, 0.12)"
  ink-primary: "#e6edf3"
  ink-heading: "#f8fafc"
  ink-label: "#e2e8f0"
  ink-prose: "#cbd5e1"
  ink-secondary: "#94a3b8"
  ink-muted: "#7c8aa0"
  annotation-blue: "#3b82f6"
  annotation-blue-deep: "#2563eb"
  annotation-blue-bright: "#60a5fa"
  annotation-blue-light: "#93c5fd"
  annotation-wash: "rgba(59, 130, 246, 0.14)"
  on-annotation: "#ffffff"
  status-work: "#3b82f6"
  status-practiced: "#a855f7"
  status-learned: "#22c55e"
  status-learning: "#f59e0b"
  status-planned: "#64748b"
  error-red: "#ef4444"
  error-text: "#f87171"
  warning-text: "#fbbf24"
  success-text: "#4ade80"
typography:
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "-0.01em"
  node-title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "13.5px"
    fontWeight: 600
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  input:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "14.5px"
    fontWeight: 400
  control:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "12px"
    fontWeight: 500
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.05em"
  badge:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif'
    fontSize: "11px"
    fontWeight: 600
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "12px"
    lineHeight: 1.5
  mono-sm:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "11px"
rounded:
  xs: "4px"
  sm: "6px"
  row: "7px"
  md: "8px"
  card: "9px"
  lg: "10px"
  xl: "12px"
  group: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  map-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.control}"
    rounded: "{rounded.row}"
    padding: "5px 11px"
  map-tab-active:
    backgroundColor: "{colors.annotation-blue}"
    textColor: "{colors.on-annotation}"
  map-tab-active-hover:
    backgroundColor: "{colors.annotation-blue-deep}"
  button-ghost:
    backgroundColor: "{colors.margin-navy}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  button-ghost-active:
    backgroundColor: "{colors.annotation-wash}"
    textColor: "{colors.annotation-blue-light}"
  button-primary:
    backgroundColor: "{colors.annotation-blue}"
    textColor: "{colors.on-annotation}"
    typography: "{typography.control}"
    rounded: "{rounded.row}"
    padding: "6px 12px"
  chip-filter:
    backgroundColor: "{colors.margin-navy}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  chip-filter-active:
    backgroundColor: "{colors.annotation-wash}"
    textColor: "{colors.annotation-blue-light}"
  tag:
    backgroundColor: "{colors.annotation-wash}"
    textColor: "{colors.annotation-blue-light}"
    typography: "{typography.mono-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  status-badge:
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "1px 6px"
  input-search:
    backgroundColor: "{colors.margin-navy}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.input}"
    padding: "12px 16px"
  card-trio:
    backgroundColor: "{colors.card-navy}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "11px 13px"
  relation-item:
    backgroundColor: "{colors.card-navy}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "7px 10px"
  tech-node:
    backgroundColor: "{colors.node-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    width: "220px"
    height: "68px"
  inline-code:
    backgroundColor: "{colors.slate-wash}"
    textColor: "{colors.annotation-blue-light}"
    typography: "{typography.mono}"
    rounded: "{rounded.xs}"
    padding: "1px 4px"
  code-block:
    backgroundColor: "{colors.code-well}"
    textColor: "{colors.ink-label}"
    typography: "{typography.mono}"
    rounded: "{rounded.md}"
    padding: "12px"
  sidebar:
    backgroundColor: "{colors.panel-navy}"
    width: "268px"
  detail-panel:
    backgroundColor: "{colors.panel-navy}"
    width: "430px"
  modal-search:
    backgroundColor: "{colors.panel-navy}"
    rounded: "{rounded.xl}"
    width: "600px"
---

# Design System: Tech Graph

## Overview

**Creative North Star: "The Annotated Map"**

The graph is the map and the cards are the margin notes. The canvas gives you the territory: categories as tinted regions, technologies as labelled pins, relations as roads. The detail panel is where you stop and read what you wrote. Reading matters as much as navigating, so the card's what / why / problem trio and its code example get the calmest, most legible treatment in the app.

The mood is calm and focused, precise and honest, and a little friendly. It is calm because the chrome stays in slate and navy and only content carries saturated colour. It is precise because every hue, border style and opacity encodes a fact about a node: its status, its category, whether it lives on another map. It is friendly because of the soft corners, emoji kind icons and small hover lifts, so that a recruiter opening a shared link meets something approachable rather than an IDE.

Density is high but not cramped. Small type (11–13px), tight 4–12px gaps and three docked panes make a laptop screen hold a whole map. The canvas sits on a quiet dot grid, and everything floats over it at clearly separated depths.

**Key Characteristics:**
- Dark-only, built on four navy steps from Margin Navy to Raised Navy.
- Saturated colour only where it states a fact: the five statuses, selection and validation results. Categories speak in soft atlas tints, so vivid colour on the map always means status.
- Dashed lines mean distance: a node you haven't touched yet, or one whose home is another map.
- Monospace marks identifiers: ids, tags, keyboard hints, code.
- Soft, tactile controls: rounded corners at every scale, visible hover feedback, small lifts.

## Colors

Ink-dark navy surfaces with slate text. One blue does the interface work, five vivid status hues carry learning facts, and a muted, content-owned atlas palette marks where each node belongs. The two voices never share a register: status is ink, category is the region it's written on.

### Primary
- **Annotation Blue** (`annotation-blue`): the pen's ink. Active map tab, primary buttons, focused borders, the "what" stripe on a card, the selected-edge highlight. Its deeper step **Annotation Blue Deep** is the hover for filled blue controls.
- **Annotation Blue Bright** (`annotation-blue-bright`): small emphasised text on navy, such as active-filter counts, the layout badge, highlighted edges and search-result tags.
- **Annotation Blue Light** (`annotation-blue-light`): text on a blue wash. Active chips and toggles, tags, external links, inline code.
- **Annotation Wash** (`annotation-wash`): the translucent blue behind anything selected or active (filter rows, chips, search results, relation hover). It appears at 12–15% alpha across the code; 14% is the reference.

### Status (semantic, fixed)
Each status is drawn three ways at once: the node's border colour, a pill badge with a 16–18% tint of the hue, and a dot in legends and filters.
- **Work** (`status-work`): used in commercial work. Solid border.
- **Practiced** (`status-practiced`): personal projects. Solid border.
- **Learned** (`status-learned`): course-complete. Solid border.
- **Learning** (`status-learning`): in progress. Solid border.
- **Planned** (`status-planned`): not started. The only status with a **dashed** border.

**Known overlap:** Work shares its hex with Annotation Blue on purpose; the accent stays findable through shape (solid tab, ring, wash) rather than hue. The card trio still reuses status hues (what = blue, why = learned green, problem = learning amber). This is the incumbent state. Don't extend the overlap to new meanings.

### Category palette (content-owned atlas tints)
Category colours live in `content/maps.yaml`, not in CSS, and come from twelve muted **atlas tints**: pastel, low-chroma map-region colours that can't be mistaken for a status. They alternate between two steps, OKLCH L 0.82 / C 0.065 and L 0.74 / C 0.075, at 30° hue intervals:

| Tint | Hex | Tint | Hex |
|---|---|---|---|
| Rose | `#ebb4b7` | Seafoam | `#92d2d1` |
| Clay | `#d49c84` | Glacier | `#75b5cf` |
| Sand | `#ddbf95` | Dusk | `#a8c7ee` |
| Olive | `#b1ae76` | Lavender | `#a5a5d9` |
| Moss | `#b2cea4` | Mauve | `#d4b8e2` |
| Sage | `#7dba9f` | Heather | `#ce98b6` |

They appear only as identity marks: the 5px bar on a node's left edge, the category label text (7.4–10.3:1 on Node Surface), legend dots and mini progress bars, and the group frame (border at about 40% alpha, header at about 13%, fill at about 7%). Within a map no two categories share a tint, and categories next to each other in `maps.yaml` order never take neighbouring tints, because the atlas packs them side by side. Backend uses all twelve. Frontend's nine leave Rose, Olive and Mauve free, which belong to the Backend categories (Auth & Security, Realtime, Architecture) that also appear on the Frontend map. A new category takes one of the twelve; the schema requires a 6-digit hex. A category with no config falls back to Ink Secondary, never to a status hue.

### Neutral
- **Margin Navy** (`margin-navy`): the page and canvas ground, also the inset fill for inputs, chips and segmented controls.
- **Panel Navy** (`panel-navy`): docked panes (toolbar, sidebar, detail panel) and modal bodies.
- **Card Navy** (`card-navy`): cards inside panels (trio cards, relation rows, links, error items).
- **Raised Navy** (`raised-navy`): the highest resting tone, used for active segments, kbd keys, map chips and table headers.
- **Node Surface** (`node-surface`): the fill of a graph node, a half-step between Margin and Card Navy.
- **Code Well** (`code-well`): code blocks, darker than the page so code reads as sunk into the card.
- **Border Navy** (`border-navy`): the default 1px line for every pane, card and control. **Border Strong** (`border-strong`, `--border-strong` in CSS) is its hover state, the edge of both modals and the resting scrollbar thumb, which brightens to Ink Muted on hover. **Border Subtle** is the faint rule under Markdown headings.
- **Slate Wash** (`slate-wash`): the neutral 12–16% slate behind inline code, ghost-node map badges and cross-map chips in relation rows. It marks an identifier or a place without claiming a status or a selection.
- **Ink Primary / Heading / Label / Prose** (`ink-primary`, `ink-heading`, `ink-label`, `ink-prose`): text from brightest to softest. Headings in Markdown use Ink Heading, group titles and code use Ink Label, and paragraphs and lists use Ink Prose.
- **Ink Secondary** (`ink-secondary`) and **Ink Muted** (`ink-muted`): control text, metadata, counts, uppercase section labels and placeholders.

### Feedback
Validation results use red, amber and green on 10–20% tints of themselves, with lighter text: **Error Red** with **Error Text**, the learning amber with **Warning Text**, the learned green with **Success Text**. The error banner is the one place a large surface turns red (deep red at 94% opacity); on it, text is white and the button edge a pale rose so they stay legible, and that rose appears nowhere else.

### Named Rules
**The Facts-Only Colour Rule.** Saturated colour appears only where it encodes a fact: a status, the current selection, or a validation result. Categories use atlas tints, and everything else is navy and slate.

**The Ink-and-Region Rule.** Status is vivid ink; category is a pastel region. Never give a category a saturated hue, and never draw a status in a tint. If a viewer can't tell which channel a colour belongs to at a glance, one of them has drifted.

**The Dashed-Means-Distance Rule.** A dashed border means the node is not yours yet (`planned`) or lives on another map (ghost node or ghost group). Nothing else is dashed.

## Typography

**Body Font:** the system UI stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, Inter, Roboto, sans-serif)
**Mono Font:** the system mono stack (`ui-monospace`, `SFMono-Regular`, Menlo, Monaco, Consolas, monospace)

**Character:** native and unbranded on purpose. The system sans keeps the interface feeling like a tool you live in, and the mono face is the voice of the content's identifiers: what you'd type, not what you'd read.

### Hierarchy
- **Headline** (700, 19px, 1.2): the node name at the top of the detail panel. The largest type in the app.
- **Title** (700, 15px, −0.01em): the "Tech Graph" wordmark and modal titles.
- **Node Title** (600, 13.5px): technology names on the canvas, search result titles and Markdown headings (700 there). Truncates with an ellipsis rather than wrapping.
- **Body** (400, 13px, 1.5–1.6): the trio text and Markdown body. Reading text sits in a 430px panel, which keeps lines near 60 characters.
- **Input** (400, 14.5px): the search field, the only text input.
- **Control** (500, 12–12.5px): buttons, tabs, filter rows, relation rows, links.
- **Label** (700, 10.5–11.5px, 0.05em, uppercase): section titles in the sidebar and detail panel, and trio labels. Group titles on the canvas use the same treatment at 12px with 0.02em.
- **Badge** (600, 11px): status pills, map chips, counts.
- **Mono** (12px, 1.5) / **Mono Small** (11px): code blocks and inline code at 12px; node ids, tags, kbd hints and error messages at 11–11.5px.

**Phone reading scale** (phone layout only): the node card steps up so it reads like an article. Card title 22px, Markdown headings 17px, trio and body text 16px, relation and link rows 15px, inline code and tables 14px, code blocks 13px, labels 12px, tags 13px. Search result titles are 16px with 14px descriptions. The search input is 16px on every touch device so iOS doesn't zoom on focus.

### Named Rules
**The Mono-for-Identifiers Rule.** Anything the user could type or paste (an id, a tag, a shortcut, a code sample, a validation message) is set in mono. Names and prose never are.

**The Quiet Label Rule.** Uppercase is reserved for small Ink Muted section labels and canvas group titles. Never uppercase a name, a button or a sentence.

## Layout

A full-viewport, three-pane workspace with no page scroll: a toolbar on top (8px × 16px padding) holding the brand, map tabs, search, the Layers/Network segmented switch and the status legend. Below it sit the **sidebar** on the left (268px; filters, progress, legend), the **canvas** in the centre (flexible), and the **detail panel** on the right (430px, at most 45vw), which appears when a node is selected. Each pane scrolls independently.

The canvas uses a dot grid (22px gap, 1.2px dots, a navy just above the ground) under fixed-size 220 × 68px nodes. In Layers mode the category frames are packed into a compact **atlas** in `maps.yaml` category order (ELK rectpacking, aspect ratio 1.5), ghost groups last; inside each frame nodes flow left to right (ELK layered). In Network mode they float free. Overlays on the canvas (info pill, empty state) are centred, translucent and blurred.

**Landing and far view.** The root URL opens the Frontend map. Fitting a whole map never zooms out below 40%; a map that doesn't fit is centred at 40% instead of shrinking to unreadable type. Below 75% zoom the canvas switches to a **far view**: node text drops to the name alone at 26px canvas units (about 10–20px on screen), nodes take a 24% tint of their status colour (18% for planned), group titles grow to 26px with no count, edge labels hide, and unhighlighted edges fade to 40%. Navigating to a node (search, relation, ghost, deep link, Back/Forward) always re-centres on it at 115%, in the part of the canvas the card leaves uncovered. Clicking a node that the opening card would hide pans it back into view at the current zoom.

Spacing is a dense 4px rhythm: 4–8px between related items, 10–12px inside cards and rows, 16–18px between sections, 12–16px pane padding. Half-steps (6px, 10px, 14px) are common inside controls.

**Responsive behaviour:** at 1360px and below, the toolbar legend hides, the sidebar narrows to 240px and the detail panel to 380px. At 1024px and below, the sidebar and detail panel stop docking and overlay the canvas from their edges with a heavy side shadow (detail panel at most 88vw), and the sidebar starts closed.

**Phones** (640px and below, or a touch screen at most 480px tall, which covers phones held sideways) get a reading layout, not a smaller workspace:
- **Toolbar:** two rows. The first holds an icon-only filters button, the brand and search; the second is a swipeable strip of map tabs whose right edge fades out, so it reads as scrollable. The Layers/Network switch, the edge-label toggle and the validation badge are desktop-only.
- **Node card:** takes the whole screen above the toolbar and has a close button but no Center action. Its content is capped at 680px and centred, so landscape lines stay readable. It respects the phone's safe areas (notch and home bar).
- **Search:** takes the whole screen too, with a text Cancel button in place of the Esc hint and no keyboard footer. Result descriptions are cut to two lines, and tags stay on one line that fades out.
- **Canvas and sidebar:** the minimap hides and the sidebar opens at up to 320px (86vw) when asked.

Touch devices at any width get 44px hit areas on buttons and rows (36px on chips) and no keyboard hints. Node hover lifts only happen where real hover exists.

Modals (search, error panel) are top-aligned at 9vh over a 72% navy backdrop with a 4px blur. Search is 600px wide, the error panel 680px, both at most 92–94vw and 76–78vh, and both edged in Border Strong rather than Border Navy because they float above everything.

## Elevation & Depth

Tonal panels, lifted floaters. Docked surfaces separate by tone alone: Margin Navy → Panel Navy → Card Navy → Raised Navy, each edged with a 1px Border Navy line. Shadows exist only on things that float above the canvas or the workspace, and they are always dark and soft, never coloured, except for the selected node's status ring.

### Shadow Vocabulary
- **Node rest** (`box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35)`): every graph node, so pins sit above the map.
- **Node selected** (`box-shadow: 0 0 0 2px <status colour>, 0 8px 24px rgba(0, 0, 0, 0.55)`): a status-coloured ring plus a deeper lift. The border turns Ink Heading white.
- **Panel edge** (`box-shadow: -8px 0 28px rgba(0, 0, 0, 0.45)`): the detail panel's left edge. At 1024px and below the overlaid sidebar casts the mirror shadow (`8px 0 28px rgba(0, 0, 0, 0.55)`).
- **Modal** (`box-shadow: 0 24px 56px rgba(0, 0, 0, 0.65)`): search and the error panel.
- **Banner** (`box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55)`): the floating error banner.
- **Segment** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35)`): the active Layers/Network segment, the only shadow inside a control.

### Named Rules
**The Float-Only Shadow Rule.** If it's docked, it's flat. A shadow says "this is above the map": nodes, the detail panel, overlaid panes, modals, banners. Cards inside a panel never cast one.

**The Translucent Overlay Rule.** Anything laid directly over the canvas (info pill, empty state, modal backdrop) is navy at 72–94% opacity with a 4–8px backdrop blur, so the map stays faintly visible underneath.

## Shapes

Soft corners at every scale, stepping up with the size of the object: 4px for kbd keys, inline code and micro-badges; 6px for small buttons and chips; 7px for tabs and filter rows; 8px for buttons, rows, links and code blocks; 9px for cards; 10px for nodes and the tab rail; 12px for modals and the empty state; 14px for category group frames; and full pills for status badges, tags and counts. Nothing is square.

Lines are 1px everywhere except where they carry meaning: node borders are 1.8px (the status line), group frames 1.5px, and accent stripes 3px (the trio's left edge, error and warning items) or 5px (the category bar on a node). Status and legend dots are 7–9px circles with a 1.5px border that copies the node's solid or dashed style.

## Components

**Character:** soft and tactile. Controls are rounded, sit on inset navy wells and answer every hover with a brighter border, brighter text or a blue wash within 120–150ms. With a mouse, controls are compact (12px text, 4–7px vertical padding). On touch screens the same controls grow to 44px hit areas (36px for chips) without changing their look. When they change, they move toward roomier hit areas, not denser ones.

### Buttons
- **Shape:** gently rounded (8px; 6px for small panel actions, 7px for filled primary buttons).
- **Ghost (default):** Margin Navy fill, 1px Border Navy, Ink Secondary text at control size, 6px × 10px padding. Hover brightens the text to Ink Primary and the border to Border Strong. Reset and Clear filters are ghost buttons too: amber belongs to Learning and to warnings.
- **Active / toggled:** Annotation Blue border, Annotation Wash fill, Annotation Blue Light text.
- **Primary:** solid Annotation Blue, white 600-weight text, 6px × 12px, no border. Used sparingly, for example "reset filters" in the empty state.
- **Close / icon:** borderless and transparent; hover adds an 8% white wash.
- **Validation button (toolbar):** takes the tint of its result: green when clean, amber with warnings, red with errors.
- **Transitions:** `all 0.15s ease`.

### Map tabs and segmented control
- **Tabs:** a 3px-padded Margin Navy rail (10px radius, 1px border) holding transparent 7px-radius tabs with a node-count pill. The active tab is solid Annotation Blue with white text and a translucent white count pill; hover on the active tab deepens to Annotation Blue Deep.
- **Segmented (Layers / Network):** the same rail at 8px radius. The active segment lifts to Raised Navy with Ink Primary text and the Segment shadow, not blue, because it's a view setting rather than a place.

### Chips
- **Kind filter chips:** Margin Navy, 6px radius, 1px border, emoji and name plus a muted count. Active means Annotation Wash fill, Annotation Blue border and Annotation Blue Light text.
- **Tags:** mono, full pill, Annotation Wash with a 30% blue border and Annotation Blue Light text.
- **Status badges:** full pill, 600 weight, text and border in the status colour over its 16–18% tint.
- **Map / meta chips:** Raised or Margin Navy, 6px radius, Ink Secondary. A map chip is clickable and turns its border blue on hover.

### Cards / Containers
- **Trio card (what / why / problem):** Card Navy, 9px radius, 1px Border Navy, with a 3px left stripe (blue for what, green for why, amber for problem). An uppercase Ink Muted label sits over 13px / 1.5 Ink Primary text. This is the heart of the reading experience.
- **Card order:** trio, then the Markdown body (Example, Key points), then connections, links, and tags last. The substance comes before the index.
- **Relation row:** Card Navy, 8px radius, a full-width button showing a status dot, kind emoji, a 600-weight name, an optional map chip (the map's name, not its id, never uppercase) and an italic Ink Secondary verb. The verb reads in the relation's direction: before the name for outgoing rows ("authored with →"), after it for backlinks ("→ integrates with"). On phones a long name wraps under the verb. Hover turns the border Annotation Blue over a 10% wash. Each direction (outgoing, backlinks) shows its first six rows; the rest sit behind a native `<details>` disclosure ("N more", 12px Ink Secondary, 4% white wash on hover).
- **Link row:** the same shape with Annotation Blue Light text.
- **Inline code:** in Markdown, the trio and search descriptions, a mono chip in Annotation Blue Light on a 12% slate wash, 4px radius, 1px × 4px padding. Backticks in frontmatter text render as inline code, never as literal backticks.
- **Code block:** Code Well fill, 1px border, 8px radius, 12px padding, horizontal scroll. The syntax palette is violet keywords (`#c084fc`), blue functions and titles (`#60a5fa`), green strings (`#86efac`), amber numbers and attributes (`#fbbf24`), and muted italic comments (Ink Muted).

### Inputs / Fields
- **Search:** the only text input. It is borderless and transparent inside a Margin Navy header row of the search modal, with 14.5px text and a mono kbd hint. On touch screens the hint becomes a 15px Annotation Blue Light "Cancel" text button. Focus is carried by the modal itself; results below highlight the active row with Annotation Wash and a 45% blue border. A query starting with `#` matches tag prefixes only. Result rows show the map's name, never its id.
- **Checkboxes:** native, with 12px Ink Secondary labels.

### Navigation
- **Toolbar:** Panel Navy band with a bottom border. The brand (emoji logo, 15px bold "Tech Graph", 11px node and relation count) sits at the left, map tabs in the middle, and search, mode switch, edge-label toggle, validation button and legend on the right. It wraps when narrow.
- **Sidebar filter rows:** transparent 7px-radius rows with a status or category dot, a 500-weight label and a tabular-number count. Hover adds a 4% white wash. Active means Annotation Wash with a 45% blue border. Category rows add a 3px mini progress bar in the category hue. A row or kind chip whose count is zero on the current map is disabled at 45% opacity with no hover.
- **Progress bar:** a 7px pill track on Margin Navy, segmented by status colour, animating width over 250ms.
- **History:** every change of map, node or mode is a browser history entry, so Back retraces a walk through relations. Only the first load and unreadable deep links rewrite the URL in place.

### Tech Node (signature)
The pin on the map: 220 × 68px, Node Surface fill, 10px radius, a 1.8px border in the **status** colour (dashed when planned), and a 5px **category** bar down the left edge. Inside are a kind emoji, a 13.5px semibold name that truncates with an ellipsis, then a meta row with the category name in its own hue on the left and the status pill on the right. States:
- **Hover:** lifts 1px over 150ms.
- **Selected:** Ink Heading border, status-coloured 2px ring, deeper shadow.
- **Ghost** (home is another map): dashed border, 68% opacity on a translucent fill, an "↗ map" badge in place of the category name, and 95% opacity on hover.
- **Dimmed** (not a neighbour of the selection): 25% opacity over 180ms.
- **Far** (zoom below 75%): name only, 26px, up to two balanced lines; the fill takes the status tint so status still reads when the border is sub-pixel.
Connection handles are 6px slate dots at 40% opacity.

### Category Group (signature, Layers mode)
A 14px-radius frame whose 1.5px border, header band and fill are the category's atlas tint at roughly 40%, 13% and 7% alpha. A bullet dot, an uppercase 12px Ink Label title and a pill count sit in the header. Ghost groups use a dashed frame and are titled "↗ <map name>", matching the ghost-node badge. In the far view the title grows to 26px and truncates with an ellipsis, the dot to 18px, and the count hides.

### Edges
Smooth slate lines (`rgba(148, 163, 184, 0.55)`), fading to 22% when dimmed. Relations of the selected node turn Annotation Blue Bright as a solid 2.2px stroke. Edges never animate or dash (see The Dashed-Means-Distance Rule). Labels sit on a dark rounded plate and appear on hover or selection, or always when the edge-label toggle is on.

### Icons
The kind icons and logo are emoji today (🔤 language, 🏗️ framework, 📦 library, 🛠️ tool, ☁️ service, 💡 concept, ⚙️ platform; 🕸️ logo). They are **placeholders**: a proper SVG icon set may replace them, so don't build new identity on emoji.

## Do's and Don'ts

### Do:
- **Do** encode status through the node's border colour, its pill badge and its legend dot together, using the five fixed status tokens.
- **Do** use a category's hue only as a mark: the 5px node bar, its label text, its dot and its group frame tints.
- **Do** show active and selected controls with Annotation Wash, an Annotation Blue border and Annotation Blue Light text. Reserve solid Annotation Blue for the current map tab and primary buttons.
- **Do** separate docked surfaces by navy tone and 1px Border Navy lines, and give a shadow only to things that float (see The Float-Only Shadow Rule).
- **Do** set ids, tags, keyboard hints, code and validation messages in the mono stack.
- **Do** keep transitions short and eased (120–250ms) and limit movement to the 1px node lift. Under `prefers-reduced-motion` every transition, animation and viewport move is instant.
- **Do** show keyboard focus as a 2px Annotation Blue outline at a 2px offset on `:focus-visible`. A focused node takes the outline at a 3px offset (6px wide at a 6px offset in the far view) and returns to full opacity even when dimmed. Enter or Space on a focused node opens its card.
- **Do** give every new rounded element a corner from the existing scale (4/6/7/8/9/10/12/14/pill), stepping up with its size.

### Don't:
- **Don't** use a status hue for decoration or for a meaning other than its status. Status colours state facts about the author's experience.
- **Don't** use a dashed border for anything except planned nodes and ghost nodes or groups (see The Dashed-Means-Distance Rule).
- **Don't** put a shadow on cards or rows inside a docked panel.
- **Don't** fill large surfaces with Annotation Blue or any saturated hue. The error banner is the only full-colour surface.
- **Don't** make new design decisions that depend on the emoji icons; they are placeholders for an SVG set.
- **Don't** hard-code new category colours in CSS or components. They belong in `content/maps.yaml` and come from the twelve atlas tints.
- **Don't** give a category a saturated hue or a status hue, even a near one (see The Ink-and-Region Rule).
