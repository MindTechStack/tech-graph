# Node Registry

Полный список узлов карты. Это контракт для наполнения контента: `id` уникален глобально, связи (`relations.to`) ссылаются только на id из этого списка.
Путь файла: `content/<map>/<category>/<id>.md`.

**Статусы:** `work` 🔵 · `practiced` 🟣 · `learned` 🟢 · `learning` 🟡 · `planned` ⚪
**✚ course**: тема курса, которой не было в исходном списке; добавлена по программе курса (курс пройден полностью → `learned`).

Итого: 172 узлов (Frontend 62 · Backend 74 · Web Fundamentals 14 · DevOps 17 · AI 5), дальше будут добавляться новые.

---

## 🗺️ Map: `frontend`

### `languages` — Languages & Platform
| id | name | kind | status |
|---|---|---|---|
| html | HTML5 | language | work |
| css | CSS3 | language | work |
| scss | SCSS / Sass | language | work |
| javascript | JavaScript | language | work |
| typescript | TypeScript | language | work |
| browser-apis | Browser APIs (DOM, Storage, Events) | concept | work |

### `frameworks` — Frameworks & Meta-frameworks
| id | name | kind | status |
|---|---|---|---|
| vue | Vue 3 | framework | work |
| composition-api | Vue Composition API & Composables | concept | work |
| nuxt | Nuxt 3/4 | framework | work |
| react | React | framework | practiced |
| react-hooks | React Hooks | concept | practiced |
| nextjs | Next.js | framework | practiced |
| react-native | React Native | framework | practiced |
| expo | Expo | platform | practiced |
| svelte | Svelte 5 | framework | practiced |
| sveltekit | SvelteKit | framework | practiced |
| astro | Astro | framework | practiced |
| leptos | Leptos (Rust) | framework | practiced |

### `state-routing` — State, Routing & Forms
| id | name | kind | status |
|---|---|---|---|
| pinia | Pinia | library | work |
| vuex | Vuex | library | work |
| vue-router | Vue Router | library | work |
| vue-i18n | Vue I18n | library | work |
| vuelidate | Vuelidate | library | work |
| vueuse | VueUse | library | work |
| react-router | React Router | library | learned |
| tanstack-query | TanStack Query | library | planned |
| zustand | Zustand | library | planned |
| redux-toolkit | Redux Toolkit | library | planned |
| react-hook-form | React Hook Form | library | learned |

### `data-network` — Data & Network (client side)
| id | name | kind | status |
|---|---|---|---|
| fetch-api | Fetch API | concept | work |
| axios | Axios | library | work |
| api-error-layer | Centralized API & Error Layer | concept | work |
| firebase-fcm | Firebase Cloud Messaging | service | work |
| openai-api | OpenAI API | service | work |
| directus | Directus (headless CMS) | service | work |

### `build-performance` — Build & Performance
| id | name | kind | status |
|---|---|---|---|
| vite | Vite | tool | work |
| code-splitting | Code Splitting & Bundle Optimization | concept | work |
| lazy-loading | Lazy Loading | concept | work |
| virtual-scrolling | Virtual Scrolling | concept | work |
| pwa | Progressive Web Apps | concept | work |
| service-workers | Service Workers | concept | work |
| lighthouse | Lighthouse & Web Vitals | tool | work |

### `ui-styling` — Styling & UI Kits
| id | name | kind | status |
|---|---|---|---|
| tailwind | Tailwind CSS | library | work |
| bem | BEM methodology | concept | work |
| ant-design | Ant Design | library | work |
| vuetify | Vuetify 3 | library | work |
| quasar | Quasar | framework | work |
| bootstrap | Bootstrap | library | work |
| shadcn-ui | shadcn/ui | library | practiced |

### `ui-widgets` — Maps, Charts & Widgets
| id | name | kind | status |
|---|---|---|---|
| leaflet | Leaflet / Google Maps | library | work |
| apexcharts | ApexCharts | library | work |
| chartjs | Chart.js | library | work |
| gridstack | GridStack | library | work |

### `testing` — Frontend Testing
| id | name | kind | status |
|---|---|---|---|
| vitest | Vitest | tool | work |
| playwright | Playwright | tool | work |
| testing-library | Testing Library | library | planned |

### `quality` — Code Quality & Monitoring
| id | name | kind | status |
|---|---|---|---|
| eslint | ESLint | tool | work |
| oxlint | oxlint | tool | work |
| oxfmt | oxfmt | tool | work |
| knip | Knip | tool | work |
| sentry | Sentry | service | work (`alsoIn: [backend]`) |
| a11y | Accessibility (a11y) | concept | work |

---

## 🗺️ Map: `backend`

### `runtime` — Node.js Core
| id | name | kind | status |
|---|---|---|---|
| nodejs | Node.js | platform | practiced |
| npm | npm & package.json | tool | learned |
| nodemon | nodemon | tool | learned |
| event-loop | Event Loop & Non-blocking I/O | concept | learned |
| node-modules | Modules (CommonJS vs ES Modules) | concept | learned |
| node-http | Node `http` module | library | learned |
| node-fs | File System & Path (`fs`, `fs/promises`, `path`) ✚ course | library | learned |
| streams-buffers | Streams & Buffers | concept | learned |
| async-await | Promises & async/await ✚ course | concept | learned |
| node-debugging | Debugging Node (VS Code debugger, inspect) ✚ course | concept | learned |
| node-typescript | Node.js + TypeScript (tsc, ts-node/tsx) ✚ course | concept | learned |
| env-variables | Environment Variables (dotenv) ✚ course | concept | learned |
| deno | Deno ✚ course | platform | learned |
| oak | Oak (Deno web framework) ✚ course | framework | learned |

### `frameworks` — Frameworks & Architecture
| id | name | kind | status |
|---|---|---|---|
| express | Express.js | framework | learned |
| middleware | Middleware | concept | learned |
| mvc | MVC pattern | concept | learned |
| error-handling | Error Handling (sync, async, global) | concept | learned |
| compression | compression middleware ✚ course | library | learned |
| hono | Hono | framework | practiced |
| fastify | Fastify | framework | planned |
| nestjs | NestJS | framework | planned |

### `api` — APIs
| id | name | kind | status |
|---|---|---|---|
| rest-api | REST API | concept | learned |
| graphql | GraphQL | concept | learned |
| express-graphql | GraphQL server (express-graphql / graphql-http) | library | learned |
| pagination | Pagination | concept | learned |
| express-validator | express-validator (validation & sanitization) ✚ course | library | learned |
| multer | Multer (file uploads) ✚ course | library | learned |
| pdfkit | PDFKit (file generation) ✚ course | library | learned |

### `templating` — Templating Engines (SSR)
| id | name | kind | status |
|---|---|---|---|
| server-side-templating | Server-side Templating | concept | learned |
| pug | Pug | library | learned |
| ejs | EJS | library | learned |
| handlebars | Handlebars | library | learned |

### `database` — Databases & ORM
| id | name | kind | status |
|---|---|---|---|
| sql | SQL (relational databases) | concept | learned |
| mysql | MySQL | platform | learned |
| postgresql | PostgreSQL | platform | practiced |
| turso | Turso / libSQL (SQLite) | service | practiced |
| nosql | NoSQL | concept | learned |
| mongodb | MongoDB | platform | practiced |
| orm | ORM / ODM | concept | learned |
| sequelize | Sequelize | library | learned |
| drizzle | Drizzle ORM | library | practiced |
| mongoose | Mongoose | library | learned |

### `auth-security` — Auth & Security
| id | name | kind | status |
|---|---|---|---|
| cookies | Cookies | concept | learned |
| sessions | Sessions (express-session) | concept | learned |
| csrf | CSRF protection | concept | learned |
| helmet | Helmet | library | learned |
| bcrypt | bcrypt (password hashing) ✚ course | library | learned |
| node-crypto | Node crypto (reset tokens) ✚ course | library | learned |
| connect-flash | connect-flash (flash messages) ✚ course | library | learned |
| jwt | JSON Web Tokens ✚ course | concept | learned |
| rbac | Role-Based Access Control | concept | work (`alsoIn: [frontend]`) |
| better-auth | Better Auth | library | practiced |
| laravel-sanctum | Laravel Sanctum | service | work (`alsoIn: [frontend]`) |

### `email` — Email
| id | name | kind | status |
|---|---|---|---|
| nodemailer | Nodemailer | library | learned |
| sendgrid | SendGrid | service | learned |
| mailchimp | Mailchimp | service | learned |
| aws-ses | Amazon SES | service | learned |

### `payments` — Payments
| id | name | kind | status |
|---|---|---|---|
| stripe | Stripe | service | learned |

### `realtime` — Realtime
| id | name | kind | status |
|---|---|---|---|
| websocket | WebSocket protocol | concept | work |
| socket-io | Socket.IO | library | work (`alsoIn: [frontend]`) |
| kafka | Kafka | platform | planned |

### `observability` — Logging & Monitoring
| id | name | kind | status |
|---|---|---|---|
| logging | Logging (concepts) ❓ | concept | learned |
| morgan | Morgan | library | learned |
| pino | Pino | library | planned |
| winston | Winston | library | planned |

### `testing` — Backend Testing
| id | name | kind | status |
|---|---|---|---|
| mocha | Mocha | tool | learned |
| chai | Chai | library | learned |
| sinon | Sinon | library | learned |
| jest | Jest | tool | learned |
| supertest | Supertest | library | planned |

### `architecture` — Architecture & Typed Effects
| id | name | kind | status |
|---|---|---|---|
| effect | Effect | library | practiced (`alsoIn: [frontend]`) |
| effect-schema | Effect Schema | library | practiced |
| typed-errors | Typed Errors | concept | practiced |

---

## 🗺️ Map: `fundamentals` (Web Fundamentals)

### `http` — HTTP & Web Platform
| id | name | kind | status |
|---|---|---|---|
| http | HTTP protocol | concept | work |
| http-methods | HTTP Methods | concept | work |
| http-status-codes | HTTP Status Codes ❓ | concept | work |
| cors | CORS | concept | work |
| ssl-tls | SSL/TLS & HTTPS ❓ | concept | work |
| client-vs-server | Client vs Server code ❓ | concept | work |
| rendering-strategies | Rendering: CSR / SSR / SSG / Islands | concept | work |

### `api-tools` — API Clients
| id | name | kind | status |
|---|---|---|---|
| api-clients | API Clients: comparison ❓ | concept | work |
| postman | Postman | tool | work |
| bruno | Bruno | tool | planned |
| hoppscotch | Hoppscotch | tool | planned |
| insomnia | Insomnia | tool | planned |
| http-files | `.http` files (VS Code REST Client) | tool | planned |
| scalar | Scalar / OpenAPI | tool | planned |

---

## 🗺️ Map: `devops`

### `vcs` — Version Control
| id | name | kind | status |
|---|---|---|---|
| git | Git | tool | work |
| commitizen | Commitizen | tool | work |
| gitbutler | GitButler | tool | work |

### `containers` — Containers
| id | name | kind | status |
|---|---|---|---|
| docker | Docker | tool | work |
| docker-compose | Docker Compose | tool | planned |

### `ci-cd` — CI/CD
| id | name | kind | status |
|---|---|---|---|
| github-actions | GitHub Actions | service | work |
| gitlab-ci | GitLab CI/CD | service | work |

### `hosting` — Hosting & Platforms
| id | name | kind | status |
|---|---|---|---|
| heroku | Heroku | platform | learned |
| vercel | Vercel | platform | practiced |
| cloudflare | Cloudflare (Workers / Pages) | platform | planned |
| cloudflare-r2 | Cloudflare R2 | service | practiced |
| railway | Railway | platform | practiced |
| netlify | Netlify | platform | practiced |
| aws | AWS | platform | planned |

### `iac` — Infrastructure as Code
| id | name | kind | status |
|---|---|---|---|
| iac | Infrastructure as Code | concept | planned |
| alchemy | Alchemy | tool | planned |
| terraform | Terraform | tool | planned |

---

## 🗺️ Map: `ai`

Своя экосистема: связи только внутри карты, без ссылок на технологии других карт.

### `coding-agents` — AI Coding Agents
| id | name | kind | status |
|---|---|---|---|
| claude-code | Claude Code | tool | work |
| antigravity | Google Antigravity | tool | work |
| codex | OpenAI Codex | tool | work |

### `agent-ecosystem` — Agent Ecosystem
| id | name | kind | status |
|---|---|---|---|
| mcp | MCP (Model Context Protocol) | concept | work |
| agent-rules | Agent Rules & Skills (AGENTS.md, CLAUDE.md, SKILL.md) | concept | work |

---

## 📚 Покрытие курса (Schwarzmüller, NodeJS: The Complete Guide)

Сверка модулей курса с узлами: ничего не должно потеряться.

| Модуль курса | Узлы |
|---|---|
| JavaScript Refresher | `javascript`, `async-await` |
| Understanding the Basics | `nodejs`, `node-http`, `streams-buffers`, `event-loop`, `node-modules`, `http`, `http-methods` |
| Improved Workflow & Debugging | `npm`, `nodemon`, `node-debugging` |
| Express.js | `express`, `middleware`, `node-fs` (static files, `path`) |
| Templating Engines | `server-side-templating`, `pug`, `ejs`, `handlebars` |
| MVC / Dynamic Routes & Models | `mvc`, `express` |
| SQL & Sequelize | `sql`, `mysql`, `orm`, `sequelize` |
| NoSQL, MongoDB & Mongoose | `nosql`, `mongodb`, `mongoose` |
| Sessions & Cookies | `cookies`, `sessions` (+ session store в MongoDB внутри карточки) |
| Authentication | `bcrypt`, `csrf`, `connect-flash` |
| Sending Emails | `nodemailer`, `sendgrid`, `mailchimp`, `aws-ses` |
| Advanced Authentication | `node-crypto` (reset tokens), `rbac` (authorization) |
| Validation | `express-validator` |
| Error Handling | `error-handling`, `http-status-codes` |
| File Upload & Download | `multer`, `pdfkit`, `node-fs`, `streams-buffers` |
| Pagination | `pagination` |
| Async Requests | `fetch-api`, `rest-api` |
| Payments | `stripe` |
| REST APIs & Advanced REST | `rest-api`, `cors`, `jwt` |
| async/await | `async-await` |
| WebSockets & Socket.io | `websocket`, `socket-io` |
| GraphQL | `graphql`, `express-graphql` (GraphiQL внутри карточки) |
| Deployment | `env-variables`, `helmet`, `compression`, `morgan`, `ssl-tls` (OpenSSL self-signed), `heroku` |
| Testing | `mocha`, `chai`, `sinon`, `jest` |
| Node as a Build Tool / npm | `npm` |
| Modern JS & Node (ES Modules, promise APIs) | `node-modules`, `node-fs` |
| Node.js + TypeScript | `node-typescript`, `typescript` |
| Deno | `deno`, `oak` |

> Устаревшие инструменты из курса (`csurf`, бесплатный Heroku, `express-graphql`) в карточках помечаются блоком
> **"Today"** с актуальной заменой (`csrf-csrf`/`csrf-sync`, Render/Fly/Cloudflare, `graphql-http`/Apollo/Yoga).
