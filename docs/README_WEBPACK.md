# Документация K·ART·MAKE V5.2 — сборка

---

## Содержание

1. [Общая концепция](#1-общая-концепция)
2. [Структура проекта](#2-структура-проекта)
3. [Как это работает](#3-как-это-работает)
4. [Манифесты](#4-манифесты)
5. [Рецепты](#5-рецепты)
6. [Соглашения и правила](#6-соглашения-и-правила)
7. [Деплой в WordPress](#7-деплой-в-wordpress)
8. [Отладка](#8-отладка)
9. [Частые ошибки](#9-частые-ошибки)

---

## 1. Общая концепция

Сборка построена на **двух манифестах**, **автогенерации** и **едином `manifest.json`** для фронта и бэка.

```
pages-manifest.js  ──┐
├──► webpack.config.js ──► .webpack/pages/*.js ──► build/
modules/manifest.js ─┘                              │
│
├──► build/assets/js/*.build.js
├──► build/assets/css/*.build.css
│
└──► build/manifest.json ──► WordPress
```

**Идея:**

1. Вы описываете **что** есть (модули) и **кому что нужно** (страницы) — в двух JS-файлах.
2. Webpack генерирует entry-файлы, собирает чанки.
3. **Webpack сам решает**, как разбить код: какие модули вынести в общий чанк, а какие оставить в entry.
4. `WebpackAssetsManifest` пишет `manifest.json` — карту «entry → его чанки».
5. WordPress читает `manifest.json` и подключает ровно те чанки, что нужны для текущей страницы.

**Что это даёт:**

- Нет копипасты entry-файлов и app-классов.
- Модуль включается/выключается **одной строкой** в манифесте.
- Webpack делает **оптимальный code splitting** — не мы диктуем ему правила.
- WordPress **автоматически** подключает все чанки, включая безымянные (`385.build.js`).
- Один источник истины для фронта и бэка — `manifest.json`.

**Что это меняет по сравнению с прошлой концепцией:**

- **`appModules` cache group убрана.** Webpack свободен в разбиении.
- **Безымянные чанки (`385.build.js`, `996.build.js`) — норма.** Они попадают в `manifest.json` и подключаются автоматически.
- **`HtmlWebpackPlugin` работает только в dev** — для локальной разработки в браузере. В prod HTML не генерируется.
- **`build/manifest.json`** — то, что читает WordPress.

---

## 2. Структура проекта

```
project/
├── webpack.config.js
├── .gitignore
├── README.md
├── README_WEBPACK.md
│
├── src/
│   ├── pages/                              ← HTML-файлы (только для dev)
│   │   ├── index.html
│   │   ├── policy.html
│   │   ├── single.html
│   │   └── ...
│   │
│   ├── shared/
│   │   ├── styles/
│   │   │   ├── global.scss
│   │   │   ├── _variables.scss
│   │   │   ├── _mixins.scss
│   │   │   └── pages/
│   │   │       ├── home.scss
│   │   │       ├── policy.scss
│   │   │       └── ...
│   │   └── assets/                         ← шрифты, картинки, видео
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
│           ├── home/
│           ├── about/
│           ├── services/
│           └── calculator/
│
├── .webpack/                               ← ГЕНЕРИРУЕТСЯ (.gitignore)
│   └── pages/                              ← сгенерированные entry-файлы
│
└── build/                                  ← ГОТОВАЯ СБОРКА (.gitignore)
├── manifest.json                       ← манифест для WordPress
└── assets/
├── js/
│   ├── runtime.build.js
│   ├── vendors.build.js
│   ├── global.build.js
│   ├── 385.build.js                ← общий чанк (webpack решил)
│   ├── 996.build.js                ← общий чанк (BaseApp)
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

**Webpack сам решает**, как разбить код:

- Модуль, нужный всем страницам (`BaseApp`), выносится в общий чанк `996.build.js`.
- Модуль, нужный двум страницам (`Sidebar` в `policy` и `single`), выносится в `385.build.js`.
- Модуль, нужный одной странице (`AboutIntro`), остаётся в `about.build.js`.

Числовые имена (`385`, `996`) — авто-генерация webpack'а. **Это нормально**, не пытайтесь их переименовать.

### Шаг 4: пишет `manifest.json`

`WebpackAssetsManifest` создаёт JSON:

```json
{
  "entrypoints": {
    "global": {
      "assets": {
        "js": [
          "assets/js/runtime.build.js",
          "assets/js/vendors.build.js",
          "assets/js/global.build.js"
        ],
        "css": [
          "assets/css/global.build.css"
        ]
      }
    },
    "policy": {
      "assets": {
        "js": [
          "assets/js/runtime.build.js",
          "assets/js/996.build.js",
          "assets/js/385.build.js",
          "assets/js/policy.build.js"
        ],
        "css": [
          "assets/css/policy.build.css"
        ]
      }
    }
  }
}
```

**Ключевое:** порядок js-массивов **гарантирован webpack'ом** — `runtime → vendors → npm → global → shared → entry`.

### Шаг 5: WordPress читает манифест

`inc/enqueue.php`:

```php
$global = kartemake_get_entry_assets('global');
kartemake_enqueue_js_chain('kartemake-global', $global['js'], $version);
kartemake_enqueue_css_chain('kartemake-global', $global['css'], $version);

foreach (kartemake_get_pages_map() as $entry => $rule) {
    if (!kartemake_match_page($entry, $rule)) continue;

    $assets = kartemake_get_entry_assets($entry);
    kartemake_enqueue_js_chain("kartemake-{$entry}", $assets['js'], $version, $global['js']);
    kartemake_enqueue_css_chain("kartemake-{$entry}", $assets['css'], $version, $global['css']);

    break;
}
```

На каждой странице подключается ровно тот набор чанков, что в манифесте.

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

### 4.3 `build/manifest.json` — манифест для WordPress

Генерируется `WebpackAssetsManifest` **при каждой сборке**. Читается `inc/enqueue.php`.

```json
{
  "entrypoints": {
    "global": {
      "assets": {
        "js": [
          "assets/js/runtime.build.js",
          "assets/js/vendors.build.js",
          "assets/js/global.build.js"
        ],
        "css": [
          "assets/css/global.build.css"
        ]
      }
    },
    "home": {
      "assets": {
        "js": [
          "assets/js/runtime.build.js",
          "assets/js/996.build.js",
          "assets/js/home.build.js"
        ],
        "css": [
          "assets/css/home.build.css"
        ]
      }
    },
    "policy": {
      "assets": {
        "js": [
          "assets/js/runtime.build.js",
          "assets/js/996.build.js",
          "assets/js/385.build.js",
          "assets/js/policy.build.js"
        ],
        "css": [
          "assets/css/policy.build.css"
        ]
      }
    }
  }
}
```

**Пути относительные** — от корня `build/`. PHP преобразует их через `kartemake_asset_url` в полные URL.

**Структура ключей:**

- `entrypoints` — карта entry → ассеты.
- `entrypoints.<entry>.assets.js` — массив JS-чанков **в правильном порядке**.
- `entrypoints.<entry>.assets.css` — массив CSS-чанков **в правильном порядке**.

### 4.4 Маппинг `index.html` → `home.entry`

Главная физически называется `index.html`, логически — `home`. Маппинг задаётся в `webpack.config.js`:

```js
const HTML_TO_ENTRY = {
  index: 'home',
}
```

Если у вас нет такого расхождения — уберите константу или сделайте пустой.

---

## 5. Рецепты

### 5.1 Добавить новую страницу

1. **HTML:** `src/pages/mypage.html`
2. **SCSS:** `src/shared/styles/pages/mypage.scss`
3. **В `pages-manifest.js`:**
   ```js
   mypage: { scss: 'mypage.scss', modules: [] },
   ```
4. **В `inc/enqueue.php` → `kartemake_get_pages_map()`:**
   ```php
   'mypage' => null,
   ```
5. **Пересобрать:** `npm run build`.
6. **Залить `build/` в тему.**

Всё. `.webpack/pages/mypage.js` создастся автоматически, `manifest.json` получит `entrypoints.mypage`, WordPress подключит.

### 5.2 Добавить модуль на страницу

1. **Убедиться, что модуль есть в `modules/manifest.js`:**
   ```js
   MyModule: { path: './src/app/modules/global/my-module.js' },
   ```
2. **В `pages-manifest.js` добавить ключ в `modules`:**
   ```js
   policy: { scss: 'policy.scss', modules: ['Sidebar', 'MyModule'] },
   ```
3. **Пересобрать.** `MyModule` появится в `policy.build.js` (или в общем чанке — решит webpack).

### 5.3 Убрать модуль со страницы

Удалить ключ из `modules` в `pages-manifest.js`. Пересобрать.

### 5.4 Создать новый модуль

1. **Файл:** `src/app/modules/global/my-module.js`:
   ```js
   export default class MyModule {
     constructor() { console.log('[MyModule] initialized') }
   }
   ```
2. **В `modules/manifest.js`:**
   ```js
   MyModule: { path: './src/app/modules/global/my-module.js' },
   ```
3. **Указать в `pages-manifest.js`** у нужных страниц.
4. **Пересобрать.**

### 5.5 Модуль нужен на всех страницах

Импортировать его в `GlobalApp` (в `src/app/global.js`) — это правильнее, чем дублировать во всех страницах:

```js
// src/app/global.js
import MyModule from './modules/global/my-module.js'

export default class GlobalApp {
  constructor() {
    this.registry = {
      // ...
      MyModule,
    }
    // ...
  }
}
```

Модуль попадёт в `global.build.js`, будет на всех страницах.

### 5.6 Модуль нужен только одной странице

1. **`modules/manifest.js`:**
   ```js
   RareModule: { path: './src/app/modules/global/rare-module.js' },
   ```
2. **`pages-manifest.js`** — только в одной странице:
   ```js
   audit: { scss: 'audit.scss', modules: ['RareModule'] },
   ```

Webpack оставит `RareModule` внутри `audit.build.js`, не вынося в общий чанк.

### 5.7 Модуль нужен двум-трём страницам

```js
policy: { scss: 'policy.scss', modules: ['Sidebar'] },
single: { scss: 'single.scss', modules: ['Sidebar'] },
```

**Webpack сам решит:** вынести `Sidebar` в общий чанк `385.build.js` или продублировать в `policy.build.js` и `single.build.js`. Оба варианта — ок. В первом случае `385.build.js` попадёт в `manifest.json` для `policy` и `single`, и WordPress его подключит.

### 5.8 Изменить порядок инициализации модулей

Порядок в массиве `modules` = порядок, в котором `BaseApp` создаёт инстансы:

```js
policy: {
  scss: 'policy.scss',
  modules: ['Sidebar', 'MyModule'],   // Sidebar создастся первым
},
```

Для зависимостей типа `ScrollEngine` → `GSAPEngine` порядок критичен. В `GlobalApp` они разделены на `beforeRegistry` и `registry`.

---

## 6. Соглашения и правила

### Имена

| Что | Соглашение | Пример |
|---|---|---|
| HTML | `kebab-case.html` | `policy.html` |
| SCSS | `kebab-case.scss` | `policy.scss` |
| Модуль (класс) | `PascalCase` | `Sidebar` |
| Модуль (файл) | `kebab-case.js` | `sidebar.js` |
| Ключ в манифесте | `PascalCase` = имя класса | `Sidebar` |
| Ключ страницы в манифесте | `kebab-case` = имя HTML без `.html` | `policy` |
| Общий чанк | `[id].build.js` | `385.build.js` |

### `BaseApp` и `window.App`

- `GlobalApp` (в `global.js`) создаёт `window.App = {}` **первым**.
- `BaseApp` в `else`-ветке: `if (!window.App) window.App = {}`.
- **Никогда не перезаписывайте `window.App`** в других app-классах — иначе потеряете глобальные модули.

### Порядок загрузки в HTML

`manifest.json` гарантирует порядок чанков в массивах `js`:

```
runtime → vendors → npm → global → shared chunks → entry
```

WordPress подключает скрипты в **том же порядке** через `wp_enqueue_script` с зависимостями (см. `kartemake_enqueue_js_chain`).

### `global.entry.js` — единственный entry руками

Он не в манифесте, потому что `GlobalApp` особый: свой порядок инициализации (`beforeRegistry` → `registry`), свой `window.App = {}`, `SceneManager.start()` в конце.

Все остальные entry **генерируются** из `pages-manifest.js`.

### `splitChunks` — не мешаем webpack'у

Никаких `appModules` cache group. Разрешаем webpack'у выносить модули в общие чанки, как он посчитает нужным.

```js
splitChunks: {
  chunks: 'all',
  maxInitialRequests: 10,
  minSize: 0,
  cacheGroups: {
    vendors: {
      test: /[\\/]lib[\\/]/,
      name: 'vendors',
      chunks: 'all',
      priority: 20,
      enforce: true,
      reuseExistingChunk: true,
    },
    npm: {
      test: /[\\/]node_modules[\\/]/,
      name: 'npm',
      chunks: 'all',
      priority: 10,
      reuseExistingChunk: true,
    },
  },
}
```

Всё остальное — на усмотрение webpack'а.

### `HtmlWebpackPlugin` — только в dev

```js
plugins: [
  // ...
  ...(!isProduction ? pages.map(page => new HtmlWebpackPlugin({
    template: page.path,
    filename: `${page.name}.html`,
    chunks: getPageChunks(page.name),
    chunksSortMode: 'manual',
    inject: 'body',
  })) : []),
]
```

В prod HTML-файлы **не генерируются** — они не нужны WordPress'у.

### `WebpackAssetsManifest` — всегда

```js
new WebpackAssetsManifest({
  output: 'manifest.json',
  publicPath: '',               // относительные пути
  entrypoints: true,            // карта entry → чанки
  integrity: false,
  writeToDisk: true,
  transform: (assets) => {
    const filtered = { entrypoints: assets.entrypoints }
    for (const [key, value] of Object.entries(assets)) {
      if (key === 'entrypoints') continue
      if (typeof value !== 'string') continue
      if (value.endsWith('.LICENSE.txt')) continue
      if (value.endsWith('.html')) continue
      filtered[key] = value
    }
    return filtered
  },
})
```

---

## 7. Деплой в WordPress

### 7.1 Сборка

```bash
npm run build
```

### 7.2 Структура `build/`

```
build/
├── manifest.json
└── assets/
    ├── js/
    ├── css/
    ├── images/
    ├── fonts/
    └── media/
```

### 7.3 Куда копировать

**Всю папку `build/`** в тему:

```
wp-content/themes/kartemake/
├── build/
│   ├── manifest.json
│   └── assets/
├── functions.php
├── inc/
│   └── enqueue.php
└── ...
```

### 7.4 `inc/enqueue.php`

```php
<?php
if (!defined('ABSPATH')) exit;

define('KARTEMAKE_MANIFEST_PATH', '/build/manifest.json');

function kartemake_get_manifest() {
    static $manifest = null;
    if ($manifest !== null) return $manifest;

    $path = get_template_directory() . KARTEMAKE_MANIFEST_PATH;
    if (!file_exists($path)) {
        error_log('[kartemake] manifest.json not found: ' . $path);
        return $manifest = [];
    }

    $data = json_decode(file_get_contents($path), true);
    if (!is_array($data) || empty($data['entrypoints'])) {
        error_log('[kartemake] manifest.json has no entrypoints');
        return $manifest = [];
    }

    return $manifest = $data['entrypoints'];
}

function kartemake_asset_url($relative) {
    if (preg_match('#^(https?:)?//#', $relative) || str_starts_with($relative, '/')) {
        return $relative;
    }
    return get_template_directory_uri() . '/build/' . ltrim($relative, '/');
}

function kartemake_get_entry_assets($entry) {
    $manifest = kartemake_get_manifest();
    $assets = $manifest[$entry]['assets'] ?? [];

    return [
        'js'  => array_map('kartemake_asset_url', $assets['js']  ?? []),
        'css' => array_map('kartemake_asset_url', $assets['css'] ?? []),
    ];
}

function kartemake_get_pages_map() {
    return [
        'home'         => ['type' => 'front'],
        'blog'         => ['type' => 'home'],
        'single'       => ['type' => 'single'],
        'about'        => null,
        'contacts'     => null,
        'calculator'   => null,
        'services'     => null,
        'support'      => null,
        'optimization' => null,
        'modernization'=> null,
        'audit'        => null,
        'pricing'      => null,
        'policy'       => ['pages' => ['privacy-policy', 'cookie-policy']],
    ];
}

function kartemake_match_page($slug, $rule) {
    if (is_array($rule) && isset($rule['type'])) {
        switch ($rule['type']) {
            case 'front':  return is_front_page();
            case 'home':   return is_home();
            case 'single': return is_single();
        }
        return false;
    }

    if (is_array($rule)) {
        if (!empty($rule['pages'])) {
            foreach ($rule['pages'] as $s) if (is_page($s)) return true;
        }
        if (!empty($rule['templates'])) {
            foreach ($rule['templates'] as $tpl) if (is_page_template($tpl)) return true;
        }
        if (!empty($rule['extra']) && is_callable($rule['extra'])) {
            if (call_user_func($rule['extra'])) return true;
        }
        return false;
    }

    return is_page($slug) || is_page_template("page-{$slug}.php");
}

function kartemake_enqueue_js_chain($prefix, $urls, $version, $skip = []) {
    $prev = null; $i = 0;
    foreach ($urls as $url) {
        if (in_array($url, $skip, true)) continue;
        $handle = "{$prefix}-js-{$i}";
        wp_enqueue_script($handle, $url, $prev ? [$prev] : [], $version, true);
        $prev = $handle; $i++;
    }
}

function kartemake_enqueue_css_chain($prefix, $urls, $version, $skip = []) {
    $i = 0;
    foreach ($urls as $url) {
        if (in_array($url, $skip, true)) continue;
        wp_enqueue_style("{$prefix}-css-{$i}", $url, [], $version);
        $i++;
    }
}

function kartemake_enqueue_scripts() {
    $version = wp_get_theme()->get('Version');

    // Global — на всех страницах
    $global = kartemake_get_entry_assets('global');
    kartemake_enqueue_js_chain('kartemake-global', $global['js'], $version);
    kartemake_enqueue_css_chain('kartemake-global', $global['css'], $version);

    // Страничный entry
    foreach (kartemake_get_pages_map() as $entry => $rule) {
        if (!kartemake_match_page($entry, $rule)) continue;
        $assets = kartemake_get_entry_assets($entry);
        kartemake_enqueue_js_chain("kartemake-{$entry}", $assets['js'], $version, $global['js']);
        kartemake_enqueue_css_chain("kartemake-{$entry}", $assets['css'], $version, $global['css']);
        break;
    }
}
add_action('wp_enqueue_scripts', 'kartemake_enqueue_scripts');
```

### 7.5 Проверка

DevTools → Network на `/`:

```
/wp-content/themes/kartemake/build/assets/js/runtime.build.js    200
/wp-content/themes/kartemake/build/assets/js/vendors.build.js    200
/wp-content/themes/kartemake/build/assets/js/global.build.js     200
/wp-content/themes/kartemake/build/assets/js/996.build.js        200
/wp-content/themes/kartemake/build/assets/js/home.build.js       200

/wp-content/themes/kartemake/build/assets/css/global.build.css   200
/wp-content/themes/kartemake/build/assets/css/home.build.css     200
```

---

## 8. Отладка

### Проверить структуру `build/`

```bash
ls -R build/ | head -40
```

Ожидаете `manifest.json` + `assets/`. **Никаких** HTML.

### Проверить манифест

```bash
head -30 build/manifest.json
grep -c 'LICENSE\|\.html' build/manifest.json
```

`grep` должен вернуть `0`.

### Проверить, что модуль только там, где нужен

```bash
grep -l "toc-title" build/assets/js/*.build.js
```

Ожидаете только `policy.build.js` и `single.build.js` (или `385.build.js`, если webpack вынес Sidebar в общий чанк).

### Проверить порядок в манифесте

```bash
cat build/manifest.json | python3 -c "
import json, sys
m = json.load(sys.stdin)
for entry, data in m['entrypoints'].items():
    print(entry, '→', ' | '.join(data['assets']['js']))
"
```

Для `home` ожидаете: `runtime → 996 → home`. Для `policy`: `runtime → 996 → 385 → policy`.

### Dev-server

```bash
npx webpack serve --mode development
```

- Откроется `http://localhost:3000/`.
- `/` → `index.html`.
- `/policy` → `policy.html`.
- `/single` → `single.html`.

В dev **генерируются HTML** через `HtmlWebpackPlugin` — для локальной разработки в браузере.

### Полная пересборка

```bash
rm -rf build .webpack
npx webpack --mode production
```

---

## 9. Частые ошибки

### ❌ Чанк с длинным именем `appModules-src_app_core_...`

**Причина:** остался `appModules` cache group из старой конфигурации.

**Решение:** **удалить** `appModules` из `splitChunks.cacheGroups`. Webpack сам справится.

### ❌ В манифесте двойной путь `assets/js/assets/js/...`

**Причина:** `output.path` указывает на `build/assets/js/`, а `output.filename` — на `assets/js/[name].build.js`. Склейка.

**Решение:** `output.path` = `path.resolve(__dirname, 'build')` (корень `build/`).

### ❌ В манифесте префикс `wp-content/themes/...`

**Причина:** `publicPath` в `WebpackAssetsManifest` задан как абсолютный путь.

**Решение:** `publicPath: ''`. Пути будут относительные, PHP преобразует через `kartemake_asset_url`.

### ❌ В манифесте `*.html` и `*.LICENSE.txt`

**Причина:** `HtmlWebpackPlugin` генерирует HTML и `TerserPlugin` пишет лицензии в prod.

**Решение:**
1. `HtmlWebpackPlugin` — только в dev.
2. `transform` в `WebpackAssetsManifest` — отфильтровать `*.html` и `*.LICENSE.txt`.

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

**Причина:** либо `Sidebar` в `CORE` в `pages-manifest.js`, либо импортируется в `global.js` / `BaseApp`.

**Решение:** проверить, что `Sidebar` упомянут **только** у `policy` и `single` в `pages-manifest.js`.

### ❌ 404 на чанки в WordPress

**Причина:** папка `build/` не залита целиком или залита не туда.

**Решение:** проверить структуру:

```
wp-content/themes/kartemake/build/manifest.json
wp-content/themes/kartemake/build/assets/js/runtime.build.js
wp-content/themes/kartemake/build/assets/js/385.build.js
...
```

### ❌ `window.App` пустой на страницах, кроме главной

**Причина:** `GlobalApp` не инициализируется или инициализируется после страничного app.

**Решение:**

- Убедиться, что в `manifest.json` для страницы `runtime` идёт **до** `<page>.build.js`.
- Убедиться, что `global.build.js` **не пустой**.
- Убедиться, что в `src/app/global.js` есть `export default class GlobalApp`.

---

## Приложение: ключевые секции `webpack.config.js`

```js
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const MODULES = require('./src/app/modules/manifest.js');
const PAGES   = require('./src/app/pages-manifest.js');

const HTML_TO_ENTRY = { index: 'home' };
const PAGES_DIR = path.resolve(__dirname, '.webpack/pages');

const toPosix = (p) => p.replace(/\\/g, '/');
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const resolveFromRoot = (...parts) => toPosix(path.resolve(__dirname, ...parts));

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

function buildEntries() {
  return {
    global: './src/app/entries/global.entry.js',
    ...Object.fromEntries(
      Object.keys(PAGES).map(page => [page, path.join(PAGES_DIR, `${page}.js`)])
    ),
  };
}

function getPageEntries() {
  const pages = glob.sync('./src/pages/*.html');
  return pages.map(page => {
    const name = path.basename(page, '.html');
    const entryName = HTML_TO_ENTRY[name] ?? name;
    const route = page.replace('./src/pages', '').replace('.html', '');
    return { name, entryName, path: page, route: route === '/index' ? '/' : route };
  });
}

function getPageChunks(pageName) {
  const entryName = HTML_TO_ENTRY[pageName] ?? pageName;
  return ['runtime', 'vendors', 'npm', 'global', entryName];
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  generatePages();

  const entries = buildEntries();
  const pages = getPageEntries();

  return {
    mode: isProduction ? 'production' : 'development',
    entry: entries,

    output: {
      filename: 'assets/js/[name].build.js',
      chunkFilename: 'assets/js/[id].build.js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
      publicPath: '/',
      assetModuleFilename: 'assets/images/[name].[hash][ext]',
    },

    // ... rules, module

    plugins: [
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].build.css',
          chunkFilename: 'assets/css/[id].build.css',
        })
      ] : []),

      new WebpackAssetsManifest({
        output: 'manifest.json',
        publicPath: '',
        entrypoints: true,
        integrity: false,
        writeToDisk: true,
        transform: (assets) => {
          const filtered = { entrypoints: assets.entrypoints };
          for (const [key, value] of Object.entries(assets)) {
            if (key === 'entrypoints') continue;
            if (typeof value !== 'string') continue;
            if (value.endsWith('.LICENSE.txt')) continue;
            if (value.endsWith('.html')) continue;
            filtered[key] = value;
          }
          return filtered;
        },
      }),

      ...(!isProduction ? pages.map(page => new HtmlWebpackPlugin({
        template: page.path,
        filename: `${page.name}.html`,
        chunks: getPageChunks(page.name),
        chunksSortMode: 'manual',
        inject: 'body',
      })) : []),
    ],

    optimization: {
      chunkIds: 'deterministic',
      minimize: isProduction,
      runtimeChunk: { name: 'runtime' },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 10,
        minSize: 0,
        cacheGroups: {
          vendors: {
            test: /[\\/]lib[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
            enforce: true,
            reuseExistingChunk: true,
          },
          npm: {
            test: /[\\/]node_modules[\\/]/,
            name: 'npm',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: false },
            output: { comments: false },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },

    devServer: {
      static: './build',
      port: 3000,
      historyApiFallback: {
        rewrites: pages.map(page => ({
          from: new RegExp(`^${page.route}$`),
          to: `/${page.name}.html`,
        })),
      },
      open: true,
      hot: true,
    },

    devtool: isProduction ? false : 'eval-source-map',
  };
};
```

---

## Итог

**Три файла, которые вы редактируете руками:**

1. `src/app/modules/manifest.js` — что есть за модули.
2. `src/app/pages-manifest.js` — кому что нужно.
3. `src/app/entries/global.entry.js` — единственный entry руками.

**Плюс PHP:**

4. `inc/enqueue.php` — карта страниц для WordPress.

**Всё остальное генерируется:**

- `.webpack/pages/*.js` — файлы страниц.
- `build/assets/**` — чанки.
- `build/manifest.json` — карта для WordPress.

**Что изменилось по сравнению с прошлой версией:**

- Webpack сам решает, как разбивать код. `appModules` cache group **удалена**.
- Безымянные чанки (`385.build.js`, `996.build.js`) — **норма**, они в манифесте.
- `build/manifest.json` — **единая точка истины** для подключения ассетов.
- WordPress читает манифест и подключает всё автоматически.
- HTML генерируется **только в dev**.

**Добавить страницу** — 1 запись в `pages-manifest.js` + HTML + SCSS + 1 запись в PHP.
**Добавить модуль** — 1 запись в `modules/manifest.js` + указать у страниц.
**Убрать модуль со страницы** — удалить из `modules`.

Готово. Если появятся новые кейсы — дополняйте этот документ.

---

## Что я изменил по сравнению с вашей версией

| Раздел | Было | Стало |
|---|---|---|
| **1. Концепция** | «`appModules` запрещает вынос» | «Webpack сам решает, `manifest.json` читает WordPress» |
| **2. Структура** | `build/` с HTML | `build/` с `manifest.json` + `assets/` |
| **3. Как работает** | HtmlWebpackPlugin подключает чанки к HTML | WebpackAssetsManifest пишет карту, PHP подключает |
| **4. Манифесты** | 2 манифеста | 3 манифеста (+ `build/manifest.json`) |
| **5. Рецепты** | 5.5 «через CORE» | 5.5 «через GlobalApp» |
| **6. Соглашения** | `appModules` cache group | Убран, webpack свободен |
| **7. Деплой в WordPress** | — | **Новый раздел** |
| **8. Отладка** | Проверка HTML | Проверка `manifest.json` |
| **9. Частые ошибки** | `385.bundle.js` — плохо | Новые: двойной путь, `LICENSE`, `404` |
| **Приложение** | Кусок `webpack.config.js` | Полный конфиг со всеми ключевыми секциями |

---

Пришлите свой `README.md` (общий) — обновлю его тоже, чтобы согласовать с этой версией `README_WEBPACK.md`.