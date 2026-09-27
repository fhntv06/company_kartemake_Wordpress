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

Сайт построен как **multi-page application (MPA)** на ванильном JavaScript без фреймворков. Каждая страница — отдельный HTML-документ с собственным набором модулей. Блог (страница отдельной записи) работает на **WordPress** и использует те же JS-бандлы, что и остальные страницы.

### Особенности

- **Модульная система.** Каждый интерактивный блок — отдельный модуль-класс.
- **Декларативная сборка.** Модули и страницы описываются в двух JS-манифестах, Webpack генерирует всё остальное.
- **Динамическое подключение чанков.** Webpack сам решает, как разбить код. `manifest.json` описывает, какие чанки нужны каждой странице, WordPress читает его и подключает автоматически.
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
| **WebpackAssetsManifest** | Генерация `manifest.json` для WordPress |
| **HtmlWebpackPlugin** | Генерация HTML в dev (только для локальной разработки) |
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
| **PHP-тема** | Рендерит HTML, читает `manifest.json`, подключает чанки |

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

**Порядок критичен:** `GlobalApp` должен выполниться до страничного app. Это обеспечивается порядком чанков в `manifest.json` (`runtime → vendors → global → shared → entry`).

### Схема сборки

```
┌──────────────────────────────────────────────────────────────┐
│                    1. Сборка (webpack)                       │
│                                                              │
│   pages-manifest.js + modules/manifest.js                    │
│       │                                                      │
│       ├── генерирует .webpack/pages/*.js                     │
│       │                                                      │
│       ├── собирает чанки (в т.ч. общие 385, 996)             │
│       │                                                      │
│       └── WebpackAssetsManifest пишет build/manifest.json    │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ build/manifest.json
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    2. WordPress (PHP)                        │
│                                                              │
│   inc/enqueue.php                                            │
│       │                                                      │
│       ├── читает manifest.json                               │
│       │                                                      │
│       ├── определяет текущую страницу (is_front_page, ...)   │
│       │                                                      │
│       └── подключает ровно те чанки, что в манифесте         │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Структура проекта

```
project/
│
├── webpack.config.js               ← конфиг сборки
├── package.json
├── .gitignore
├── README.md
├── README_WEBPACK.md
│
├── src/
│   ├── pages/                      ← HTML-файлы (только для dev)
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
    ├── manifest.json               ← манифест для WordPress
    └── assets/
        ├── js/
        │   ├── runtime.build.js
        │   ├── vendors.build.js
        │   ├── global.build.js
        │   ├── 385.build.js        ← общий чанк (webpack решил)
        │   ├── 996.build.js        ← общий чанк (BaseApp)
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

В dev-режиме `HtmlWebpackPlugin` генерирует HTML-файлы и вставляет чанки напрямую — удобно для локальной разработки без WordPress.

### Продакшн-сборка

```bash
npm run build
```

Результат — в `build/`:

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

**HTML-файлы в prod не генерируются** — WordPress рендерит их сам, а `inc/enqueue.php` подключает чанки из манифеста.

### Деплой

Скопировать **всю папку `build/`** в тему:

```
wp-content/themes/kartemake/build/
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

**Как webpack решает, куда положить модуль:**

- Модуль нужен одной странице — остаётся в её entry-бандле.
- Модуль нужен двум-трём страницам — webpack может вынести его в общий чанк (`385.build.js`). Это **нормально** и описано в `manifest.json`.
- Модуль нужен всем страницам — импортируется в `GlobalApp`, попадает в `global.build.js`.

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

Подробнее — в [README_WEBPACK.md](./README_WEBPACK.md).

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

**Страницы без модулей** — статичные лендинги с общим `GlobalApp`.

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

Страница `single.html` — это **шаблон для отдельной записи блога**. Она собирается тем же Webpack'ом, что и остальные страницы, но используется в контексте WP.

### Как это работает

1. Webpack собирает чанки и пишет `build/manifest.json`.
2. Вы копируете **всю папку `build/`** в тему:
   ```
   wp-content/themes/kartemake/build/
   ```
3. PHP читает `manifest.json` и подключает нужные чанки для каждой страницы.

### Структура на сервере

```
wp-content/themes/kartemake/
├── build/
│   ├── manifest.json
│   └── assets/
│       ├── js/
│       ├── css/
│       ├── images/
│       ├── fonts/
│       └── media/
├── functions.php
├── inc/
│   └── enqueue.php
└── ...
```

### `inc/enqueue.php`

```php
function kartemake_enqueue_scripts() {
    $version = wp_get_theme()->get('Version');

    // 1. Global — на всех страницах
    $global = kartemake_get_entry_assets('global');
    kartemake_enqueue_js_chain('kartemake-global', $global['js'], $version);
    kartemake_enqueue_css_chain('kartemake-global', $global['css'], $version);

    // 2. Страничный entry
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

### Карта страниц

```php
function kartemake_get_pages_map() {
    return [
        'home'         => ['type' => 'front'],
        'blog'         => ['type' => 'home'],
        'single'       => ['type' => 'single'],
        'about'        => null,    // is_page('about') || is_page_template('page-about.php')
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
```

### Что передаётся из WP

- Заголовок записи
- Контент
- Метаданные (дата, автор, рубрики)
- Навигация (предыдущая/следующая запись)
- Сайдбар (модуль `Sidebar`)

### `Sidebar` — общий модуль

`Sidebar` используется и в статике (`policy`), и в WP (`single`). Благодаря архитектуре:

- Он попадает **только** в `policy` и `single` (или в общий чанк `385.build.js`, если webpack так решил).
- На остальные страницы не влияет.
- `manifest.json` гарантирует, что WordPress подключит его только там, где нужно.

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

**Dev (`npm run dev`):**

```
build/
├── manifest.json
├── index.html, policy.html, single.html, ...    ← для локальной разработки
└── assets/
    ├── js/
    │   ├── runtime.build.js
    │   ├── vendors.build.js
    │   ├── global.build.js
    │   ├── 385.build.js         ← общий чанк (решает webpack)
    │   ├── 996.build.js
    │   ├── home.build.js
    │   └── ...
    └── css/
```

**Prod (`npm run build`):**

```
build/
├── manifest.json
└── assets/
    ├── js/
    │   ├── runtime.build.js
    │   ├── vendors.build.js
    │   ├── global.build.js
    │   ├── 385.build.js
    │   ├── 996.build.js
    │   ├── home.build.js
    │   └── ...
    └── css/
```

(HTML-файлы только в dev.)

### `build/manifest.json`

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
    }
  }
}
```

**Порядок чанков гарантирован webpack'ом:** `runtime → vendors → npm → global → shared → entry`.

### Что **не** выносится в отдельные чанки

Ничего. Webpack **сам решает**, как разбить код. Мы не диктуем ему правила через `splitChunks.cacheGroups`.

Если модуль нужен нескольким страницам — webpack создаст общий чанк с числовым именем (`385.build.js`). Это **нормально**: он попадёт в `manifest.json` для тех entry, где нужен, и WordPress его подключит.

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
| Общий чанк | `[id].build.js` | `385.build.js` |

### Где что лежит

- **HTML** — `src/pages/`
- **SCSS страниц** — `src/shared/styles/pages/`
- **Общие SCSS** — `src/shared/styles/`
- **Модули** — `src/app/modules/<category>/`
- **Core** — `src/app/core/`
- **Entry (руками)** — `src/app/entries/`

### Чего не делать

- ❌ Не писать `*-app.js` руками — они генерируются.
- ❌ Не импортировать модули напрямую в `global.js`, если они не глобальные.
- ❌ Не перезаписывать `window.App = {}` в app-классах — только `if (!window.App)`.
- ❌ Не добавлять `DOMContentLoaded` в `global.js` — только в `global.entry.js`.
- ❌ Не пытаться «запретить» webpack'у создавать общие чанки через `appModules` cache group — пусть решает сам.

---

## 11. Документация

- **[README_WEBPACK.md](./README_WEBPACK.md)** — как работает сборка, манифесты, рецепты, отладка.
- **[WP.md](./WP.md)** — интеграция с WordPress (если есть).
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — правила контрибуции (если есть).

---

## Лицензия

Proprietary. © K·ART·MAKE.

---

## Контакты

- Сайт: [kartmake.ru](https://kartmake.ru)
- Email: dev@kartmake.ru

---

## Что я изменил по сравнению с вашей версией

| Раздел | Было | Стало |
|---|---|---|
| **1. Особенности** | «Изоляция модулей по страницам» | «Динамическое подключение чанков через `manifest.json`» |
| **2. Технологии** | `HtmlWebpackPlugin` для prod | `WebpackAssetsManifest`, `HtmlWebpackPlugin` только для dev |
| **3. Архитектура** | — | **Добавлена схема сборки** (`pages-manifest → webpack → build → WordPress`) |
| **4. Структура** | `build/*.html` + `assets/` | `build/manifest.json` + `assets/` |
| **5. Быстрый старт** | «Результат готов к деплою» | «Залить всю папку `build/`» |
| **6. Модульная система** | — | **Добавлено**: как webpack решает, куда положить модуль |
| **8. WordPress** | `single.build.js` подключается вручную | **Полностью переписан**: `inc/enqueue.php` читает `manifest.json` |
| **9. Сборка** | «Что не выносится в отдельные чанки» | «Webpack сам решает, общие чанки — норма» |
| **10. Соглашения** | «Не выносить модули» | «Не пытаться запретить webpack'у общие чанки» |
| **11. Документация** | `BUILD.md` | `README_WEBPACK.md` (соответствует имени вашего файла) |

---

## Проверка консистентности

- **README.md** ссылается на `README_WEBPACK.md` ✅
- **README_WEBPACK.md** ссылается на `README.md` ✅
- Оба документа используют одинаковую терминологию (`entry`, `chunk`, `manifest.json`, `BaseApp`, `GlobalApp`) ✅
- Схема сборки описана одинаково ✅
- Раздел «Соглашения» в README и «Соглашения и правила» в README_WEBPACK согласованы ✅

Готово. Теперь документация соответствует текущей архитектуре проекта.