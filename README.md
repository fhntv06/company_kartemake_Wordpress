# K·ART·MAKE V5.2 — README

Многостраничный сайт на чистом JavaScript с модульной архитектурой, декларативной сборкой через Webpack и WordPress-интеграцией для блога.

---

## Содержание

1. [О проекте](#1-о-проекте)
2. [Технологии](#2-технологии)
3. [Архитектура](#3-архитектура)
4. [Структура проекта](#4-структура-проекта)
5. [Быстрый старт](#5-быстрый-старт)
6. [Модульная система](#6-модульная-система)
7. [Страницы](#7-страницы)
8. [Интеграция с WordPress](#8-интеграция-с-wordpress)
9. [Сборка](#9-сборка)
10. [Соглашения](#10-соглашения)
11. [Документация](#11-документация)

---

## 1. О проекте

**K·ART·MAKE** — корпоративный сайт компании, предоставляющей услуги в области:

- оптимизации производственных процессов,
- модернизации оборудования,
- аудита производственных линий,
- поддержки и сопровождения,
- автоматизации расчётов.

Сайт построен как **multi-page application (MPA)** на ванильном JavaScript без фреймворков. Каждая страница — отдельный HTML-документ с собственным набором модулей. Блог (страница отдельной записи) работает на **WordPress** и использует тот же JS-бандл, что и остальные страницы.

### Особенности

- **Модульная система.** Каждый интерактивный блок — отдельный модуль-класс.
- **Декларативная сборка.** Модули и страницы описываются в манифестах, Webpack генерирует всё остальное.
- **Изоляция модулей по страницам.** Модуль, нужный только двум страницам, не попадает на остальные.
- **Единый визуальный язык.** SCSS-переменные, общая типографика, единые компоненты.
- **Анимации.** GSAP + ScrollTrigger, кастомный Canvas-движок для главной.
- **Плавный скролл.** Lenis.
- **Адаптивность.** Mobile-first, брейкпоинты через SCSS-миксины.

---

## 2. Технологии

### Сборка

| Технология | Назначение |
|---|---|
| **Webpack 5** | Сборщик |
| **Babel** | Транспиляция JS |
| **SASS/SCSS** | Стили |
| **MiniCssExtractPlugin** | Вынос CSS в отдельные файлы (prod) |
| **TerserPlugin** | Минификация JS |
| **CssMinimizerPlugin** | Минификация CSS |
| **HtmlWebpackPlugin** | Генерация HTML со вставкой чанков |
| **webpack-dev-server** | Dev-сервер с HMR |

### Runtime

| Технология | Назначение |
|---|---|
| **Vanilla JS (ES2020+)** | Без фреймворков |
| **GSAP + ScrollTrigger** | Анимации и скролл-триггеры |
| **Lenis** | Smooth scroll |
| **Canvas 2D** | Партиклы, анимации главной |

### Интеграция

| Технология | Назначение |
|---|---|
| **WordPress** | Блог, шаблон `single` |
| **PHP-тема** | Рендерит HTML, подключает `single.build.js` |

---

## 3. Архитектура

### Общая схема

```
┌─────────────────────────────────────────────────────────────┐
│                         Браузер                             │
│                                                             │
│  index.html   policy.html   single.html   about.html  ...  │
│      │             │             │            │             │
│      ▼             ▼             ▼            ▼             │
│  home.js       policy.js      single.js    about.js         │
│      │             │             │            │             │
│      └─────────────┴─────────────┴────────────┘             │
│                          │                                  │
│                          ▼                                  │
│                   window.App                                │
│                          ▲                                  │
│                          │                                  │
│                    GlobalApp                                │
└─────────────────────────────────────────────────────────────┘
```

### Уровни

1. **Core** — фундамент (`GlobalVariables`, `ScrollEngine`, `GSAPEngine`). Загружается **первым**.
2. **Global** — модули, нужные всем страницам (`SceneManager`, `AnchorNavigation`, `CookieController`, ...). Загружается через `GlobalApp`.
3. **Page** — модули конкретной страницы (`Sidebar`, `ServicesWheel`, `CalculatorController`, ...). Загружаются в app-классе страницы.

### `window.App`

Все модули регистрируются в глобальном объекте `window.App`:

```js
window.App = {
  // global
  ScrollEngine, GSAPEngine, SceneManager, AnchorNavigation, ...
  // page-specific
  Sidebar, ServicesWheel, ...
}
```

Это позволяет модулям ссылаться друг на друга без прямых импортов:

```js
const sceneManager = window.App.SceneManager
sceneManager.register('audit', this)
```

### Жизненный цикл

```
DOMContentLoaded
    │
    ├── new GlobalApp()    ← создаёт window.App, инициализирует core + global
    │       │
    │       ├── beforeRegistry (ScrollEngine → GSAPEngine)
    │       ├── registry (CanvasEngine, SceneManager, ...)
    │       └── SceneManager.start(), body.document-ready
    │
    └── new <Page>App()    ← добавляет page-модули в window.App
            │
            └── this.onInit?.()  ← хук для кастомной логики
```

**Порядок критичен:** `GlobalApp` должен выполниться до страничного app. Это обеспечивается порядком чанков в HTML (`chunksSortMode: 'manual'`).

---

## 4. Структура проекта

```
project/
│
├── webpack.config.js               ← конфиг сборки
├── package.json
├── .gitignore
├── README.md
│
├── src/
│   ├── pages/                      ← HTML-файлы (13 страниц)
│   │   ├── index.html
│   │   ├── policy.html
│   │   ├── single.html             ← шаблон для WP
│   │   ├── about.html
│   │   ├── services.html
│   │   ├── calculator.html
│   │   ├── blog.html
│   │   ├── contacts.html
│   │   ├── support.html
│   │   ├── optimization.html
│   │   ├── modernization.html
│   │   ├── audit.html
│   │   └── pricing.html
│   │
│   ├── shared/
│   │   ├── styles/
│   │   │   ├── global.scss         ← общие стили
│   │   │   ├── _variables.scss     ← переменные
│   │   │   ├── _mixins.scss        ← миксины
│   │   │   └── pages/
│   │   │       ├── home.scss
│   │   │       ├── policy.scss
│   │   │       └── ...
│   │   │
│   │   └── assets/                 ← шрифты, картинки, видео
│   │
│   └── app/
│       ├── pages-manifest.js       ← реестр страниц
│       ├── global.js               ← класс GlobalApp
│       │
│       ├── core/
│       │   ├── base-app.js         ← BaseApp для всех страниц
│       │   ├── scroll-engine.js
│       │   └── gsap-engine.js
│       │
│       ├── entries/
│       │   └── global.entry.js     ← единственный entry руками
│       │
│       └── modules/
│           ├── manifest.js         ← реестр модулей
│           ├── global/             ← общие модули
│           ├── home/               ← модули главной
│           ├── about/
│           ├── services/
│           └── calculator/
│
├── .webpack/                       ← ГЕНЕРИРУЕТСЯ (.gitignore)
│   └── pages/                      ← сгенерированные entry-файлы
│
└── build/                          ← ГОТОВАЯ СБОРКА (.gitignore)
    ├── *.html
    └── assets/
        ├── js/*.build.js
        ├── css/*.build.css
        ├── images/
        ├── fonts/
        └── media/
```

---

## 5. Быстрый старт

### Требования

- Node.js ≥ 18
- npm ≥ 9

### Установка

```bash
git clone <repo-url> company_kartemake_Wordpress
cd company_kartemake_Wordpress
npm install
```

### Разработка

```bash
npm run dev
```

Открывается `http://localhost:3000/`. Дев-сервер с HMR и `historyApiFallback`:

- `/` → `index.html`
- `/policy` → `policy.html`
- `/single` → `single.html`
- `/about` → `about.html`
- и так далее

### Продакшн-сборка

```bash
npm run build
```

Результат — в `build/`. Готов к деплою на сервер или в WordPress-тему.

### Просмотр продакшн-сборки

```bash
npx serve build
```

---

## 6. Модульная система

### Что такое модуль

**Модуль** — это ES-класс, который:

1. Инкапсулирует логику одного блока (меню, калькулятор, анимация, сцена).
2. Создаётся через `new Module()` без параметров.
3. Регистрируется в `window.App` под именем класса.
4. Может ссылаться на другие модули через `window.App.X`.

**Пример:**

```js
// src/app/modules/global/sidebar.js
export default class Sidebar {
  constructor() {
    this.el = document.querySelector('.sidebar')
    this.init()
  }

  init() {
    this.el?.addEventListener('click', this.onClick.bind(this))
  }

  onClick(e) {
    // ...
  }
}
```

### Как модуль попадает на страницу

Через **два манифеста**:

1. **`src/app/modules/manifest.js`** — реестр: `Sidebar → путь к файлу`.
2. **`src/app/pages-manifest.js`** — какие модули нужны каждой странице.

Например, `Sidebar` нужен только `policy` и `single`:

```js
// pages-manifest.js
policy: { scss: 'policy.scss', modules: ['Sidebar'] },
single: { scss: 'single.scss', modules: ['Sidebar'] },
```

На `home`, `about`, `services` и т.д. `Sidebar` **не попадёт** — ни в JS-бандл, ни в HTML.

### `BaseApp`

Все страничные app-классы наследуются от `BaseApp`:

```js
export default class BaseApp {
  constructor(registry, name = 'App') {
    this.name = name
    this.registry = registry
    this.modules = {}

    if (!window.App) {
      console.warn(`[${name}] window.App does not exist. GlobalApp may not be initialized.`)
      window.App = {}
    }

    for (const [key, Module] of Object.entries(this.registry)) {
      const instance = new Module()
      this.modules[key] = instance
      window.App[key] = instance
    }

    this.onInit?.()
    console.log(`[${name}] initialized`)
  }
}
```

`onInit` — хук для кастомной логики после создания модулей (например, регистрация сцен в `SceneManager`).

### Генерация

`BaseApp` и `*-app.js` **не пишутся руками** для каждой страницы. Webpack генерирует их в `.webpack/pages/*.js` из `pages-manifest.js`.

Подробнее — в [документации по сборке](./BUILD.md).

---

## 7. Страницы

| Страница | HTML | SCSS | Модули |
|---|---|---|---|
| **Главная** | `index.html` | `home.scss` | HeroParticleAssembly, OrbitNavigation, ArchitectureBuilder, AuditEngine, Terminal, PipelineScroll, SolutionsEngine, SceneRegistry |
| **Политика** | `policy.html` | `policy.scss` | Sidebar |
| **Запись блога** | `single.html` | `single.scss` | Sidebar |
| **О компании** | `about.html` | `about.scss` | AboutIntro |
| **Услуги** | `services.html` | `services.scss` | ServicesWheel |
| **Калькулятор** | `calculator.html` | `calculator.scss` | CalculatorController |
| **Блог** | `blog.html` | `blog.scss` | — |
| **Контакты** | `contacts.html` | `contacts.scss` | — |
| **Поддержка** | `support.html` | `support.scss` | — |
| **Оптимизация** | `optimization.html` | `optimization.scss` | — |
| **Модернизация** | `modernization.html` | `modernization.scss` | — |
| **Аудит** | `audit.html` | `audit.scss` | — |
| **Цены** | `pricing.html` | `pricing.scss` | — |

**Страницы без модулей** — статичные лендинги с общим `GlobalApp` и `Sidebar` не нужен.

**Страницы с модулями** — имеют собственную интерактивность.

### Глобальные модули (на всех страницах)

- `GlobalVariables` — общие переменные
- `ScrollEngine` — Lenis
- `GSAPEngine` — GSAP + ScrollTrigger
- `CanvasEngine` — Canvas 2D API
- `SceneManager` — управление сценами
- `AnchorNavigation` — анкорные ссылки
- `DashboardMenu` — меню
- `TransitionLoader` — переходы между страницами
- `CookieController` — cookie-баннер
- `ModalController` — модалки
- `CostCalculator` — расчёт стоимости

---

## 8. Интеграция с WordPress

Страница `single.html` — это **шаблон для отдельной записи блога**. Она собирается тем же Webpack-ом, что и остальные страницы, но используется в контексте WP.

### Как это работает

1. Webpack собирает `single.build.js` и `single.build.css`.
2. Файлы подключаются в PHP-шаблоне темы (`single.php`).
3. HTML-структура `single.html` повторяет структуру, которую рендерит WP.

### Что передаётся из WP

- Заголовок записи
- Контент
- Метаданные (дата, автор, рубрики)
- Навигация (предыдущая/следующая запись)
- Сайдбар (тот самый `Sidebar`)

### `Sidebar` — общий модуль

`Sidebar` — единственный модуль, который используется и в статике (`policy`), и в WP (`single`). Благодаря архитектуре:

- Он попадает **только** в `policy.build.js` и `single.build.js`.
- На остальные страницы не влияет.
- Подключается к `single.php` через `single.build.js`.

Подробнее — в [документации по WordPress](./WP.md) (если есть).

---

## 9. Сборка

### Скрипты `package.json`

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "clean": "rm -rf build .webpack"
  }
}
```

### Что генерируется

```
build/
├── index.html, policy.html, single.html, ...
└── assets/
    ├── js/
    │   ├── runtime.build.js       ← webpack runtime
    │   ├── npm.build.js           ← библиотеки из node_modules
    │   ├── vendors.build.js       ← библиотеки из lib/
    │   ├── global.build.js        ← core + global модули
    │   ├── home.build.js          ← модули главной
    │   ├── policy.build.js        ← Sidebar
    │   └── ...
    ├── css/
    │   ├── global.build.css
    │   ├── home.build.css
    │   └── ...
    ├── images/
    ├── fonts/
    └── media/
```

### Подключение чанков к HTML

`HtmlWebpackPlugin` автоматически вставляет в каждую страницу **только** нужные чанки:

```html
<script src="/assets/js/runtime.build.js"></script>
<script src="/assets/js/npm.build.js"></script>
<script src="/assets/js/global.build.js"></script>
<script src="/assets/js/policy.build.js"></script>
```

**Порядок** — `runtime → vendors → npm → global → page`. Критичен для корректного `window.App`.

### Что **не** выносится в отдельные чанки

Модули из `src/app/modules/` и `src/app/core/` — **никогда** не выносятся в общий чанк. Они дублируются в entry-бандлы тех страниц, где нужны.

Это гарантирует:

- Нет «магических» чанков вроде `385.bundle.js`.
- `Sidebar` не попадает на главную, даже если он импортируется на `policy` и `single`.
- Каждая страница имеет полный набор нужных модулей.

---

## 10. Соглашения

### Имена

| Сущность | Стиль | Пример |
|---|---|---|
| HTML | `kebab-case.html` | `policy.html` |
| SCSS | `kebab-case.scss` | `policy.scss` |
| Модуль (класс) | `PascalCase` | `Sidebar` |
| Модуль (файл) | `kebab-case.js` | `sidebar.js` |
| Ключ модуля в манифесте | `PascalCase` | `Sidebar` |
| Ключ страницы | `kebab-case` | `policy` |

### Где что лежит

- **HTML** — `src/pages/`
- **SCSS страниц** — `src/shared/styles/pages/`
- **Общие SCSS** — `src/shared/styles/`
- **Модули** — `src/app/modules/<category>/`
- **Core** — `src/app/core/`
- **Entry (руками)** — `src/app/entries/`

### Чего не делать

- ❌ Не писать `*-app.js` руками — они генерируются (кроме `home-app.js`, если нужен `onInit`).
- ❌ Не импортировать модули напрямую в `global.js`, если они не глобальные.
- ❌ Не перезаписывать `window.App = {}` в app-классах — только `if (!window.App)`.
- ❌ Не добавлять `DOMContentLoaded` в `global.js` — только в `global.entry.js`.

---

## 11. Документация

- **[BUILD.md](./BUILD.md)** — как работает сборка, манифесты, рецепты, отладка.
- **[WP.md](./WP.md)** — интеграция с WordPress (если есть).
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — правила контрибуции (если есть).

---

## Лицензия

Proprietary. © K·ART·MAKE.

---

## Контакты

- Сайт: [kartmake.ru](https://kartmake.ru)
- Email: dev@kartmake.ru