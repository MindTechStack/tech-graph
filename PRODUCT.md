# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: the author.** A working frontend developer (commercial Vue/Nuxt stack) who has completed a Node.js backend course and keeps learning. Uses Tech Graph to recall topics, see how technologies connect, track what is learned versus planned, and rehearse explanations before interviews.
- **Secondary: showcase visitors.** Recruiters, employers and colleagues who receive the deployed link and browse it to judge what the author knows and how they think about technology.

## Product Purpose

An interactive knowledge map of technologies and concepts, the relations between them, and a card per node answering *what it is, why you'd reach for it, and what problem it solves*, plus key points, a code example, links and an honest learning status.

Success: the author can find and refresh any topic in seconds, decide what to study next from visible progress, and hand someone a link that shows the breadth and depth of their knowledge without explanation.

## Positioning

Not a generic roadmap. It is one developer's own map: every node carries a truthful status grounded in real use (commercial work, personal projects, course, in progress, planned), written in their own words with their own examples, and every relation is explicit and labelled. The map grows by adding Markdown files as new topics are learned.

## Operating Context

- **Exploring** (relations, maps, layouts, filters, progress) happens on a laptop or desktop.
- **Reading** (search, then a node's card) must also work on a phone. On phones, search and node cards open full-screen for reading. The graph is still reachable there, but exploring it isn't designed for phones.
- Typical sessions: quick lookup via search (Ctrl+K), browsing a map before an interview, reviewing progress after finishing a course module, sharing a deep link (`#/<map>/<nodeId>`) to a specific node.

## Capabilities and Constraints

- **Maps:** Frontend, Backend, Web Fundamentals, DevOps, and All (overview). Each map has ordered, coloured categories defined in `content/maps.yaml`.
- **Nodes:** one Markdown file per node at `content/<map>/<category>/<id>.md`; frontmatter holds metadata and relations, the body holds `## Example` and `## Key points`. Template: `content/_TEMPLATE.md`. Registry and contract: `NODES.md`.
- **Kinds:** language, framework, library, tool, service, concept, platform.
- **Statuses:** `work` (commercial use), `practiced` (personal projects), `learned` (course), `learning` (in progress / open questions), `planned`.
- **Relations:** labelled edges from a fixed vocabulary (`runs on`, `built on`, `alternative to`, `ORM for`, `replaced by`…); backlinks are derived. A node lives in one home map; links from other maps show it as a **ghost node** that jumps to its home map. `alsoIn` makes a node a full member of several maps.
- **Views:** Layers (category atlas: groups packed in category order, ELK layered inside each) and Network (free graph, ELK stress). Filters by category, status and kind; search across name, tags and `what`; neighbour highlighting; edge labels on hover/selection or always; per-map and per-category progress counts; in-app error panel for invalid content.
- **Content rules:** content is English (planning docs are Russian). Validation via Effect Schema; `npm run validate` fails on broken relations, duplicate ids, unknown categories and self-links.
- **Undecided:** deploy URL/domain (Cloudflare via Alchemy, task E8); whether showcase visitors need any framing beyond the app itself; README (task T7.1) and CI (task T7.3) not written yet.

## Brand Commitments

- Name: **Tech Graph**.
- Card voice: concise and technical; each node answers what / why / problem in one sentence each, then gives a minimal realistic code example and the key points, including pitfalls and a "Today" note for legacy course tools.

## Evidence on Hand

- 159 content nodes with 527 relations across four maps (`content/`). Status split: 52 work, 13 practiced, 61 learned, 8 learning, 25 planned.
- Course source: "NodeJS — The Complete Guide (MVC, REST APIs, GraphQL, Deno)" by Maximilian Schwarzmüller, completed in full.
- Absent, and not to be fabricated: testimonials, endorsements, certificates, usage analytics, a live URL, a logo or other brand assets, and project case studies.

## Product Principles

1. **Honest status beats impressive status.** Visitors see it too; a status claims only what the author has actually done.
2. **The card is the product; the graph is the index.** Every node earns its place with a real what / why / problem and a working example.
3. **Connections are first-class.** Relations, backlinks and ghost nodes are how understanding is shown, not decoration.
4. **Markdown in git is the source of truth.** Adding knowledge means adding one validated file, never editing UI code.
5. **Read anywhere, explore at a desk.** Lookup and reading work on any screen; the full graph workspace can assume a laptop.
