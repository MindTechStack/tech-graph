# Tech Graph: план проекта

Интерактивная карта знаний: технологии и концепции, связи между ними, описание каждой («what / why / problem»), статус изучения, ссылки и примеры кода.
Расширяется добавлением Markdown-файлов: DevOps, Effect, Alchemy и всё, что будет изучено дальше.

> Связанные документы:
> - [NODES.md](./NODES.md) — реестр всех узлов карты (id, категория, тип, статус)
> - [TASKS.md](./TASKS.md) — разбивка на задачи и этапы

---

## 1. Принятые решения

| Вопрос | Решение |
|---|---|
| Фреймворк | **React + TypeScript + Vite**: заодно практика React |
| Граф | **React Flow** (`@xyflow/react`) + **ELK.js** для автораскладки |
| Язык контента | **English** (документы плана на русском) |
| Объём | **Все технологии, подробно.** Отдельные детальные карты для Frontend и Backend |
| Курс | «NodeJS — The Complete Guide (MVC, REST APIs, GraphQL, Deno)», Maximilian Schwarzmüller |
| Данные | Один Markdown-файл на узел: frontmatter (метаданные и связи) + тело (заметки, код) |
| Валидация | **Effect Schema**: первая практика Effect |
| Деплой (позже) | Статический сайт через **Alchemy**: практика Alchemy |

---

## 2. Карты (maps)

Приложение показывает несколько карт с переключением вкладками. Каждая карта — это отдельный детальный граф.

| Map | Содержание |
|---|---|
| **Frontend** | Языки, фреймворки (Vue / React / Svelte / Astro), состояние и роутинг, сеть, сборка и перформанс, UI-киты, тестирование, качество кода |
| **Backend** | Node.js core, Express и архитектура, API (REST/GraphQL), шаблонизаторы, БД и ORM, безопасность, email, платежи, realtime, логирование, тесты, Effect |
| **Web Fundamentals** | HTTP, статус-коды, CORS, SSL/TLS, клиент vs сервер, стратегии рендеринга, API-клиенты (Postman и альтернативы) |
| **DevOps** | Git, Docker, CI/CD, хостинг, IaC (Alchemy, Terraform) |
| **AI** | AI-агенты для кода (Claude Code, Antigravity, Codex), MCP, правила и скиллы агентов. Своя экосистема, без связей с другими картами |
| **All** | Все узлы вместе (обзорный режим) |

**Связи между картами.** Узел живёт в одной «домашней» карте. Если к нему ведёт связь из другой карты, он показывается там как
**ghost-узел** (полупрозрачный, с пунктирной рамкой); клик переводит на его домашнюю карту.
Например, в Backend-карте `TypeScript` и `Socket.IO client` видны как ghost-узлы из Frontend.
Через `alsoIn: [frontend]` узел можно сделать полноценным участником нескольких карт.

**Два режима раскладки** (переключатель):
- **Layers**: категории показаны блоками-группами, узлы внутри, раскладка ELK `layered` (слева направо по связям).
- **Network**: свободный граф без групп (ELK `stress`/`force`), цвет узла по категории.

---

## 3. Архитектура

```
content/**/*.md ──► parse frontmatter ──► Effect Schema ──► graph builder ──► ELK layout ──► React Flow UI
content/maps.yaml ─┘                        (ошибки → панель ошибок + `npm run validate`)
```

### Стек
| Часть | Библиотека |
|---|---|
| UI | React 19, TypeScript, Vite |
| Граф | `@xyflow/react` (React Flow 12) |
| Раскладка | `elkjs` (в Web Worker, если понадобится) |
| Frontmatter | `yaml` + свой маленький парсер `---` (gray-matter тянет Node `Buffer`) |
| Валидация | `effect` (Schema) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| Состояние UI | React state + context. Zustand, если станет тесно (тоже в списке на изучение) |
| Стили | CSS Modules / plain CSS с переменными, тёмная тема |
| Тесты | Vitest (парсер, валидация, построение графа) |
| Качество | oxlint + oxfmt (как на работе) |

### Структура
```
Tech graph/
├─ PLAN.md  NODES.md  TASKS.md  README.md
├─ content/
│  ├─ maps.yaml                      ← карты и категории: порядок, цвет, описание
│  ├─ frontend/<category>/<id>.md
│  ├─ backend/<category>/<id>.md
│  ├─ fundamentals/<category>/<id>.md
│  └─ devops/<category>/<id>.md
├─ scripts/validate.ts               ← CLI-проверка контента (для CI)
└─ src/
   ├─ content/   schema.ts, parse.ts, load.ts, graph.ts    ← чистая логика, покрыта тестами
   ├─ layout/    elk.ts                                     ← layered / network
   ├─ components/ GraphCanvas, TechNode, GroupNode, DetailPanel, Sidebar, Toolbar, ErrorPanel
   ├─ state/     useAppState.ts (выбранная карта, узел, фильтры, режим), url-sync
   └─ styles/
```

Карта и категория узла берутся **из пути файла** (`content/backend/database/sequelize.md` → map `backend`, category `database`), поэтому их не нужно дублировать во frontmatter.

---

## 4. Схема узла

````markdown
---
id: sequelize                 # уникальный, kebab-case, совпадает с именем файла
name: Sequelize
kind: library                 # language | framework | library | tool | service | concept | platform
status: learned               # см. статусы ниже
tags: [orm, sql]
what: Promise-based ORM for Node.js that works with SQL databases (MySQL, PostgreSQL, SQLite).
why: Lets you define tables as models and query them with JS objects instead of raw SQL.
problem: Raw SQL is verbose, error-prone, and disconnected from application code.
relations:
  - { to: mysql,   label: "ORM for" }
  - { to: nodejs,  label: "runs on" }
  - { to: drizzle, label: "alternative" }
links:
  - { title: Docs, url: https://sequelize.org/docs/v6/ }
alsoIn: []                    # опционально: дополнительные карты
core: false                   # опционально: true = узел виден во вкладке Main stack
source: course                # course | work | personal | self-study
---

## Example
```js
const User = sequelize.define('User', { name: DataTypes.STRING });
await User.create({ name: 'Maksym' });
```

## Key points
- Associations: hasMany / belongsTo / belongsToMany
- Migrations vs `sync()`
````

### Статусы
| status | Значение | Вид на графе |
|---|---|---|
| `work` | Используется в коммерческой работе | синий, сплошная рамка |
| `practiced` | Применялось в личных проектах | фиолетовый |
| `learned` | Изучено на курсе | зелёный |
| `learning` | Изучаю сейчас / есть открытые вопросы | янтарный |
| `planned` | В планах | серый, пунктир |

### Словарь подписей связей
`runs on`, `built on`, `written in`, `ORM for`, `ODM for`, `driver for`, `alternative to`, `uses`, `implements`,
`protects against`, `integrates with`, `tests`, `part of`, `compiles to`, `deploys to`, `replaced by`, `client for`.

---

## 5. Вопросы → карточки-концепты (Web Fundamentals)

| Вопрос | Узел | Содержание карточки |
|---|---|---|
| Статус-коды | `http-status-codes` | Классы 1xx–5xx; 200, 201, 204, 301/302, 304, 400, 401 vs 403, 404, 409, **422**, 429, 500, 502/503. *505 = HTTP Version Not Supported (редко), скорее всего имелся в виду 500.* Таблица «ситуация в Express → код» |
| Клиент vs сервер (Astro) | `client-vs-server` | Что только на сервере (секреты, БД, авторизация, валидация, цены/платежи), что на клиенте (UI-состояние, интерактив, UX-валидация). Astro: frontmatter, islands, `client:*`, endpoints, Actions, SSR vs SSG |
| Что лучше Postman | `api-clients` | Bruno, Hoppscotch, Insomnia, `.http`-файлы, Scalar: сравнение по офлайну, git, цене, скриптам |
| Логирование | `logging` | Уровни, структурированные JSON-логи, request-id, Morgan vs Pino/Winston, что не логировать, куда отправлять |
| SSL/TLS | `ssl-tls` | HTTPS, handshake, сертификаты, Let's Encrypt, терминация TLS на прокси/платформе, HSTS (Helmet). *В курсе это часть модуля Deployment* |

---

## 6. Функции

**MVP:** вкладки карт; Layers/Network; цвет по категории + стиль по статусу; карточка в боковой панели (Markdown, код, кликабельные связи, ссылки);
фильтры по категориям, статусам и типам; поиск; подсветка соседей; ghost-узлы других карт; deep-link `#/backend/express`; легенда; панель ошибок контента.

**Потом:** прогресс по картам и категориям; путь обучения от узла; экспорт PNG/SVG; CI-валидация; деплой через Alchemy.

---

## 7. Открытые вопросы
См. конец [TASKS.md](./TASKS.md).
