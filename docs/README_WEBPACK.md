# Документация K·ART·MAKE V5.2 — сборка

---

## Содержание

1. [Общая концепция](#1-общая-концепция)
2. [Структура проекта](#2-структура-проекта)
3. [Как это работает](#3-как-это-работает)
4. [Манифесты](#4-манифесты)
5. [Рецепты](#5-рецепты)
6. [Соглашения и правила](#6-соглашения-и-правила)
7. [Отладка](#7-отладка)
8. [Частые ошибки](#8-частые-ошибки)

---

## 1. Общая концепция

Сборка построена на **двух манифестах** и **автогенерации**.

```
pages-manifest.js  ──┐
                     ├──► webpack.config.js ──► .webpack/pages/*.js ──► build/
modules/manifest.js ─┘
```

**Идея:** вы описываете **что** есть (модули) и **кому что нужно** (страницы) — в двух JS-файлах. Webpack генерирует все entry-файлы и подключает нужные чанки к HTML автоматически.

**Что это даёт:**

- Нет копипасты entry-файлов и app-классов.
- Модуль включается/выключается **одной строкой** в манифесте.
- Нет «магических» безымянных чанков вроде `385.bundle.js`.
- `Sidebar` (или любой модуль) попадает только туда, где он реально нужен.

---

## 2. Структура проекта

```
project/
├── webpack.config.js
├── .gitignore
│
├── src/
│   ├── pages/                              ← HTML-файлы
│   │   ├── index.html
│   │   ├── policy.html
│   │   ├── single.html
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
│   │   └── styles/
│   │       ├── global.scss                 ← общие стили
│   │       └── pages/
│   │           ├── home.scss
│   │           ├── policy.scss
│   │           ├── single.scss
│   │           └── ...
│   │
│   └── app/
│       ├── pages-manifest.js               ← реестр страниц
│       ├── global.js                       ← класс GlobalApp
│       │
│       ├── core/
│       │   ├── base-app.js                 ← BaseApp
│       │   ├── scroll-engine.js
│       │   └── gsap-engine.js
│       │
│       ├── entries/
│       │   └── global.entry.js             ← единственный entry руками
│       │
│       └── modules/
│           ├── manifest.js                 ← реестр модулей
│           ├── global/
│           │   ├── sidebar.js
│           │   ├── canvas-engine.js
│           │   ├── scene-manager.js
│           │   └── ...
│           ├── home/
│           │   ├── architecture-builder.js
│           │   ├── audit-engine.js
│           │   └── ...
│           ├── about/
│           │   └── about-intro.js
│           ├── services/
│           │   └── services-wheel.js
│           └── calculator/
│               └── calculator-controller.js
│
├── .webpack/                               ← ГЕНЕРИРУЕТСЯ (в .gitignore)
│   └── pages/
│       ├── home.js
│       ├── policy.js
│       └── ...
│
└── build/                                  ← ГЕНЕРИРУЕТСЯ (в .gitignore)
    ├── index.html
    ├── policy.html
    └── assets/
        ├── js/
        │   ├── runtime.build.js
        │   ├── npm.build.js
        │   ├── global.build.js
        │   ├── home.build.js
        │   ├── policy.build.js
        │   └── ...
        ├── css/
        │   ├── global.build.css
        │   ├── home.build.css
        │   └── ...
        ├── images/
        ├── fonts/
        └── media/
```

### `.gitignore`

```
node_modules/
build/
.webpack/
```

---

## 3. Как это работает

### Шаг 1: webpack читает манифесты

```js
// webpack.config.js
const MODULES = require('./src/app/modules/manifest.js');   // что есть
const PAGES   = require('./src/app/pages-manifest.js');     // кому что нужно
```

### Шаг 2: генерирует файлы страниц

Для каждой страницы из `pages-manifest.js` создаёт `.webpack/pages/<page>.js`:

```js
// .webpack/pages/policy.js — АВТОГЕНЕРАЦИЯ
import '/abs/path/src/shared/styles/pages/policy.scss';

import BaseApp from '/abs/path/src/app/core/base-app.js';
import Sidebar from '/abs/path/src/app/modules/global/sidebar.js';

class PolicyApp extends BaseApp {
  constructor() {
    super({ Sidebar }, 'PolicyApp');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PolicyApp();
  console.log('[policy] initialized');
});
```

### Шаг 3: собирает чанки

```
entry 'global'  →  ./src/app/entries/global.entry.js
entry 'home'    →  .webpack/pages/home.js
entry 'policy'  →  .webpack/pages/policy.js
entry 'single'  →  .webpack/pages/single.js
...
```

### Шаг 4: подключает чанки к HTML

Для каждой HTML-страницы в `<head>`/`<body>` подставляются:

```
runtime.build.js  →  vendors.build.js  →  npm.build.js
      →  global.build.js  →  <page>.build.js
```

Через `HtmlWebpackPlugin` с `chunks: ['runtime','vendors','npm','global', pageName]`.

### Шаг 5: `splitChunks` не выносит модули приложения

Cache group `appModules` с `name: false` + `reuseExistingChunk: false` — гарантия, что `Sidebar` **дублируется** в `policy.build.js` и `single.build.js`, но не выносится в безымянный чанк.

---

## 4. Манифесты

### 4.1 `src/app/modules/manifest.js` — реестр модулей

Единственное место, где указано **откуда** импортировать модуль по имени.

```js
module.exports = {
  // ── CORE ────────────────────────────────────────────
  GlobalVariables:      { path: './src/app/modules/global/variables.js' },
  ScrollEngine:         { path: './src/app/core/scroll-engine.js' },
  GSAPEngine:           { path: './src/app/core/gsap-engine.js' },

  // ── GLOBAL ──────────────────────────────────────────
  CanvasEngine:         { path: './src/app/modules/global/canvas-engine.js' },
  SceneManager:         { path: './src/app/modules/global/scene-manager.js' },
  AnchorNavigation:     { path: './src/app/modules/global/anchor-navigation.js' },
  DashboardMenu:        { path: './src/app/modules/global/dashboard-menu.js' },
  TransitionLoader:     { path: './src/app/modules/global/transition-loader.js' },
  CookieController:     { path: './src/app/modules/global/cookie-controller.js' },
  ModalController:      { path: './src/app/modules/global/modal.js' },
  CostCalculator:       { path: './src/app/modules/global/cost-calculator.js' },

  // ── COMMON ──────────────────────────────────────────
  Sidebar:              { path: './src/app/modules/global/sidebar.js' },

  // ── HOME ────────────────────────────────────────────
  HeroParticleAssembly: { path: './src/app/modules/global/hero-particle-assembly.js' },
  OrbitNavigation:      { path: './src/app/modules/global/orbit-navigation.js' },
  ArchitectureBuilder:  { path: './src/app/modules/home/architecture-builder.js' },
  AuditEngine:          { path: './src/app/modules/home/audit-engine.js' },
  Terminal:             { path: './src/app/modules/home/terminal.js' },
  PipelineScroll:       { path: './src/app/modules/home/pipeline-scroll.js' },
  SolutionsEngine:      { path: './src/app/modules/home/solutions-engine.js' },
  SceneRegistry:        { path: './src/app/modules/home/scene-registry.js' },

  // ── ABOUT ───────────────────────────────────────────
  AboutIntro:           { path: './src/app/modules/about/about-intro.js' },

  // ── SERVICES ────────────────────────────────────────
  ServicesWheel:        { path: './src/app/modules/services/services-wheel.js' },

  // ── CALCULATOR ──────────────────────────────────────
  CalculatorController: { path: './src/app/modules/calculator/calculator-controller.js' },
}
```

**Ключ** — имя модуля в `window.App` (класс).
**`path`** — путь к файлу относительно корня проекта.

### 4.2 `src/app/pages-manifest.js` — реестр страниц

Единственное место, где указано, **какие модули** нужны странице и **какой scss** подключать.

```js
module.exports = {
  // ── HOME ────────────────────────────────────────────
  home: {
    scss: 'home.scss',
    modules: [
      'HeroParticleAssembly',
      'OrbitNavigation',
      'ArchitectureBuilder',
      'AuditEngine',
      'Terminal',
      'PipelineScroll',
      'SolutionsEngine',
      'SceneRegistry',
    ],
  },

  // ── POLICY ──────────────────────────────────────────
  policy: {
    scss: 'policy.scss',
    modules: ['Sidebar'],
  },

  // ── SINGLE ──────────────────────────────────────────
  single: {
    scss: 'single.scss',
    modules: ['Sidebar'],
  },

  // ── ABOUT ───────────────────────────────────────────
  about: {
    scss: 'about.scss',
    modules: ['AboutIntro'],
  },

  // ── SERVICES ────────────────────────────────────────
  services: {
    scss: 'services.scss',
    modules: ['ServicesWheel'],
  },

  // ── CALCULATOR ──────────────────────────────────────
  calculator: {
    scss: 'calculator.scss',
    modules: ['CalculatorController'],
  },

  // ── остальные ───────────────────────────────────────
  blog:         { scss: 'blog.scss',         modules: [] },
  contacts:     { scss: 'contacts.scss',     modules: [] },
  support:      { scss: 'support.scss',      modules: [] },
  optimization: { scss: 'optimization.scss', modules: [] },
  modernization:{ scss: 'modernization.scss', modules: [] },
  audit:        { scss: 'audit.scss',        modules: [] },
  pricing:      { scss: 'pricing.scss',      modules: [] },
}
```

**Ключ** — имя страницы (совпадает с именем entry).
**`scss`** — имя файла в `src/shared/styles/pages/`.
**`modules`** — массив ключей из `modules/manifest.js`.

### 4.3 Маппинг `index.html` → `home.entry`

Главная страница физически называется `index.html`, а логически — `home`. Маппинг задаётся в `webpack.config.js`:

```js
const HTML_TO_ENTRY = {
  index: 'home',
}
```

Если у вас нет такого расхождения — просто уберите эту константу (или сделайте пустой).

---

## 5. Рецепты

### 5.1 Добавить новую страницу

1. **Создать HTML:** `src/pages/mypage.html`
2. **Создать scss:** `src/shared/styles/pages/mypage.scss`
3. **Добавить в `pages-manifest.js`:**

   ```js
   mypage: { scss: 'mypage.scss', modules: [] },
   ```

4. **Пересобрать:**

   ```bash
   npx webpack --mode development
   ```

Всё. Файл `.webpack/pages/mypage.js` создастся автоматически, `mypage.html` в `build/` подключит нужные скрипты.

### 5.2 Добавить модуль на страницу

1. **Убедиться, что модуль есть в `modules/manifest.js`:**

   ```js
   MyModule: { path: './src/app/modules/global/my-module.js' },
   ```

   Если нет — добавить.

2. **В `pages-manifest.js` добавить ключ в `modules` нужных страниц:**

   ```js
   policy: {
     scss: 'policy.scss',
     modules: ['Sidebar', 'MyModule'],   // ← добавили
   },
   ```

3. **Пересобрать.** `MyModule` появится в `policy.build.js`.

### 5.3 Убрать модуль со страницы

Удалить ключ из `modules` в `pages-manifest.js`:

```js
policy: {
  scss: 'policy.scss',
  modules: ['Sidebar'],   // ← MyModule убрали
},
```

Пересобрать. Модуль исчезнет из `policy.build.js`.

### 5.4 Создать новый модуль

1. **Создать файл:** `src/app/modules/global/my-module.js`

   ```js
   export default class MyModule {
     constructor() {
       console.log('[MyModule] initialized')
     }
   }
   ```

2. **Добавить в `modules/manifest.js`:**

   ```js
   MyModule: { path: './src/app/modules/global/my-module.js' },
   ```

3. **Указать в `pages-manifest.js` у нужных страниц:**

   ```js
   policy: { scss: 'policy.scss', modules: ['Sidebar', 'MyModule'] },
   ```

4. **Пересобрать.**

### 5.5 Модуль должен быть на всех страницах

Добавить его во **все** страницы в `pages-manifest.js`:

```js
home:         { scss: 'home.scss',         modules: ['MyModule', ...] },
policy:       { scss: 'policy.scss',       modules: ['MyModule', ...] },
single:       { scss: 'single.scss',       modules: ['MyModule', ...] },
// ... и так далее
```

Либо вынести его в `CORE`-массив, если он должен быть везде без исключений, и использовать спред:

```js
const CORE = ['MyModule']

module.exports = {
  home: { scss: 'home.scss', modules: [...CORE, 'HeroParticleAssembly'] },
  policy: { scss: 'policy.scss', modules: [...CORE, 'Sidebar'] },
  // ...
}
```

> **Внимание:** `CORE` в `pages-manifest.js` — это **не то же самое**, что `entry 'global'` в webpack. `GlobalApp` (в `global.entry.js`) загружается на **каждой** странице, но это отдельный entry. Если модуль нужен всем — добавьте его либо в `GlobalApp` (руками в `src/app/global.js`), либо в `CORE` в `pages-manifest.js`.

### 5.6 Модуль нужен только одной странице

1. В `modules/manifest.js`:

   ```js
   RareModule: { path: './src/app/modules/global/rare-module.js' },
   ```

2. В `pages-manifest.js` — только в одной странице:

   ```js
   audit: { scss: 'audit.scss', modules: ['RareModule'] },
   ```

Модуль попадёт только в `audit.build.js`. В `policy.build.js`, `home.build.js` и т.д. его **не будет**.

### 5.7 Модуль нужен двум-трём страницам

Повторяем ключ в `modules` у нужных страниц:

```js
policy: { scss: 'policy.scss', modules: ['Sidebar'] },
single: { scss: 'single.scss', modules: ['Sidebar'] },
```

`Sidebar` попадёт в `policy.build.js` и `single.build.js`. Благодаря `appModules` cache group — **не выносится** в отдельный чанк, а дублируется. На `home`, `about` и т.д. его нет.

### 5.8 Изменить порядок инициализации модулей

Порядок в массиве `modules` = порядок, в котором `BaseApp` создаёт инстансы:

```js
policy: {
  scss: 'policy.scss',
  modules: ['Sidebar', 'MyModule'],   // Sidebar создастся первым
},
```

Для зависимостей типа `ScrollEngine` → `GSAPEngine` порядок критичен.

---

## 6. Соглашения и правила

### Имена

| Что | Соглашение | Пример |
|---|---|---|
| HTML | `kebab-case.html` | `policy.html` |
| SCSS | `kebab-case.scss` | `policy.scss` |
| Модуль (класс) | `PascalCase` | `Sidebar`, `HeroParticleAssembly` |
| Модуль (файл) | `kebab-case.js` | `sidebar.js`, `hero-particle-assembly.js` |
| Ключ в манифесте | `PascalCase` = имя класса | `Sidebar` |
| Ключ страницы в манифесте | `kebab-case` = имя HTML без `.html` | `policy` |

### `BaseApp` и `window.App`

- `GlobalApp` (в `global.js`) создаёт `window.App = {}` **первым**.
- `BaseApp` в `else`-ветке: `if (!window.App) window.App = {}`.
- **Никогда не перезаписывайте `window.App`** в других app-классах — иначе потеряете глобальные модули.

### Порядок загрузки в HTML

`HtmlWebpackPlugin` вставляет скрипты в этом порядке:

```
runtime → vendors → npm → global → <page>
```

`chunksSortMode: 'manual'` гарантирует, что порядок не будет пересортирован. `inject: 'body'` — скрипты в конце `<body>`, без `async`/`defer`.

### `global.entry.js` — единственный entry руками

Он не в манифесте, потому что `GlobalApp` особый: свой порядок инициализации (`beforeRegistry` → `registry`), свой `window.App = {}`, `SceneManager.start()` в конце.

Все остальные entry **генерируются** из `pages-manifest.js`.

### `appModules` cache group

Регексп `/src/app/(modules|core)/` + `name: false` + `reuseExistingChunk: false`:

- Модули приложения **никогда** не выносятся в отдельный чанк.
- Если модуль импортируется в двух entry (`policy`, `single`) — он **дублируется** в оба бандла.
- В `lib/` и `node_modules/` — наоборот, выносятся в `vendors` и `npm`.

---

## 7. Отладка

### Проверить, что нет безымянных чанков

```bash
ls build/assets/js/ | grep -E '^[0-9]+\.'
```

Ожидаете: **пусто**. Если что-то есть — `appModules` cache group не сработал. Проверьте `name: false` + `reuseExistingChunk: false` + `enforce: true`.

### Проверить, что модуль только там, где нужен

```bash
grep -l "class Sidebar" build/assets/js/*.build.js
```

Ожидаете только:

```
build/assets/js/policy.build.js
build/assets/js/single.build.js
```

### Проверить, что HTML подключает нужные чанки

```bash
grep -E '<script|<link' build/index.html
```

Для главной ожидаете:

```html
<script src="/assets/js/runtime.build.js"></script>
<script src="/assets/js/npm.build.js"></script>
<script src="/assets/js/global.build.js"></script>
<script src="/assets/js/home.build.js"></script>
<link rel="stylesheet" href="/assets/css/global.build.css">
<link rel="stylesheet" href="/assets/css/home.build.css">
```

### Проверить, что `global.build.js` не пустой

```bash
ls -la build/assets/js/global.build.js
```

Должен быть **несколько КБ** (не 0).

### Dev-server

```bash
npx webpack serve --mode development
```

- Откроется `http://localhost:3000/`.
- `/` → `index.html` (собранный из `home.entry`).
- `/policy` → `policy.html`.
- `/single` → `single.html`.

`historyApiFallback.rewrites` обрабатывает маршруты.

### Очистка и пересборка

```bash
rm -rf build .webpack
npx webpack --mode development
```

`.webpack/` генерируется заново, `build/` чистится (`output.clean: true`).

---

## 8. Частые ошибки

### ❌ `385.bundle.js` в билде

**Причина:** `appModules` cache group не сработал.

**Проверить:**

```js
appModules: {
  test: /[\\/]src[\\/]app[\\/](modules|core)[\\/]/,
  name: false,
  chunks: 'all',
  priority: 30,
  enforce: true,
  reuseExistingChunk: false,
},
```

Все пять полей обязательны.

### ❌ На главной нет стилей/скриптов

**Причина:** `HTML_TO_ENTRY` не настроен или `getPageChunks` не находит entry.

**Проверить:**

```bash
grep '<script' build/index.html
```

Если пусто — добавьте:

```js
const HTML_TO_ENTRY = { index: 'home' }
```

и убедитесь, что `getPageChunks` использует маппинг.

### ❌ `global.build.js` пустой

**Причина:** `src/app/entries/global.entry.js` пуст.

**Решение:**

```js
// src/app/entries/global.entry.js
import '../shared/styles/global.scss'
import GlobalApp from '../global.js'

document.addEventListener('DOMContentLoaded', () => {
  new GlobalApp()
})
```

### ❌ `GlobalApp` создаётся дважды

**Причина:** `DOMContentLoaded` есть и в `global.entry.js`, и в `global.js`.

**Решение:** удалить `document.addEventListener("DOMContentLoaded", ...)` из `global.js`.

### ❌ Ошибка «Module not found» для модуля из манифеста

**Причина:** опечатка в ключе модуля или `path` в `modules/manifest.js`.

**Решение:** webpack выбросит ошибку вида:

```
[pages-manifest] Page "policy" references unknown module "Sidebr"
```

— исправить ключ.

### ❌ `Sidebar` появляется на всех страницах

**Причина:** либо `Sidebar` в `CORE` в `pages-manifest.js`, либо он импортируется в `global.js` / `BaseApp`.

**Решение:** проверить, что `Sidebar` упомянут **только** у `policy` и `single` в `pages-manifest.js`.

### ❌ `window.App` пустой на страницах, кроме главной

**Причина:** `GlobalApp` не инициализируется или инициализируется после страничного app.

**Решение:**

- Убедиться, что `global.build.js` идёт **до** `<page>.build.js` в HTML (`chunksSortMode: 'manual'`).
- Убедиться, что `global.build.js` **не пустой**.
- Убедиться, что в `src/app/global.js` есть `export default class GlobalApp`.

### ❌ Хочу переименовать `home` в `index` и наоборот

**Если хотите, чтобы entry назывался `index`, а не `home`:**

1. В `pages-manifest.js`: `index: { scss: 'home.scss', modules: [...] }`
2. В `HTML_TO_ENTRY` **удалить** маппинг (или сделать `index: 'index'`).
3. Удалить `home` из `pages-manifest.js`.
4. Убедиться, что `src/shared/styles/pages/home.scss` существует (scss остаётся `home.scss`).

Или проще: переименовать HTML `index.html` → `home.html`, если это не ломает роутинг.

---

## Приложение: как это выглядит в готовом виде

### `webpack.config.js` (ключевые секции)

```js
const MODULES = require('./src/app/modules/manifest.js');
const PAGES   = require('./src/app/pages-manifest.js');

const HTML_TO_ENTRY = { index: 'home' }
const PAGES_DIR = path.resolve(__dirname, '.webpack/pages');

function generatePages() {
  fs.rmSync(PAGES_DIR, { recursive: true, force: true });
  fs.mkdirSync(PAGES_DIR, { recursive: true });

  for (const [page, config] of Object.entries(PAGES)) {
    const scssPath = resolveFromRoot('src/shared/styles/pages', config.scss);
    const appClass = `${capitalize(page)}App`;

    const imports = (config.modules || []).map(name => {
      const mod = MODULES[name];
      if (!mod) throw new Error(`[pages-manifest] Page "${page}" references unknown module "${name}"`);
      return `import ${name} from '${resolveFromRoot(mod.path)}';`;
    }).join('\n');

    const registry = (config.modules || []).join(',\n    ');

    const content = `// AUTO-GENERATED. Do not edit.
import '${scssPath}';

import BaseApp from '${resolveFromRoot('src/app/core/base-app.js')}';
${imports}

class ${appClass} extends BaseApp {
  constructor() {
    super({
      ${registry}
    }, '${appClass}');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ${appClass}();
  console.log('[${page}] initialized');
});
`;

    fs.writeFileSync(path.join(PAGES_DIR, `${page}.js`), content);
  }
}
```

### `.webpack/pages/policy.js` (сгенерировано)

```js
// AUTO-GENERATED. Do not edit.
import '/abs/path/src/shared/styles/pages/policy.scss';

import BaseApp from '/abs/path/src/app/core/base-app.js';
import Sidebar from '/abs/path/src/app/modules/global/sidebar.js';

class PolicyApp extends BaseApp {
  constructor() {
    super({
      Sidebar
    }, 'PolicyApp');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PolicyApp();
  console.log('[policy] initialized');
});
```

---

## Итог

**Три файла, которые вы редактируете руками:**

1. `src/app/modules/manifest.js` — что есть за модули.
2. `src/app/pages-manifest.js` — кому что нужно.
3. `src/app/entries/global.entry.js` — единственный entry руками.

**Всё остальное генерируется:**

- `.webpack/pages/*.js` — файлы страниц.
- `build/` — итоговая сборка.

**Добавить страницу** — 1 запись в манифест + HTML + SCSS.
**Добавить модуль** — 1 запись в `modules/manifest.js` + указать у страниц.
**Убрать модуль со страницы** — удалить из `modules`.

Готово. Если появятся новые кейсы — дополняйте этот документ.