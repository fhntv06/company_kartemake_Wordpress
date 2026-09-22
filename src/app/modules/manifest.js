/*
=====================================================
K·ART·MAKE V5.2

MODULES MANIFEST

Единственный источник правды о модулях приложения.

entry — имя чанка, в который попадает модуль.
        Все модули с одинаковым entry собираются в один бандл.

path  — путь к файлу модуля относительно корня проекта.

ПОРЯДОК ВАЖЕН внутри beforeRegistry-модулей:
GlobalVariables → ScrollEngine → GSAPEngine
(порядок инициализации задаётся в pages/manifest.js)
=====================================================
*/

module.exports = {
    // ─────────────────────────────────────────────────────
    // CORE — фундамент, грузится первым на каждой странице
    // ─────────────────────────────────────────────────────
    GlobalVariables:    { entry: 'global', path: './src/app/modules/global/variables.js' },
    ScrollEngine:       { entry: 'global', path: './src/app/core/scroll-engine.js' },
    GSAPEngine:         { entry: 'global', path: './src/app/core/gsap-engine.js' },

    // ─────────────────────────────────────────────────────
    // GLOBAL — общие модули для всех страниц
    // ─────────────────────────────────────────────────────
    CanvasEngine:       { entry: 'global', path: './src/app/modules/global/canvas-engine.js' },
    SceneManager:       { entry: 'global', path: './src/app/modules/global/scene-manager.js' },
    AnchorNavigation:   { entry: 'global', path: './src/app/modules/global/anchor-navigation.js' },
    DashboardMenu:      { entry: 'global', path: './src/app/modules/global/dashboard-menu.js' },
    TransitionLoader:   { entry: 'global', path: './src/app/modules/global/transition-loader.js' },
    CookieController:   { entry: 'global', path: './src/app/modules/global/cookie-controller.js' },
    ModalController:    { entry: 'global', path: './src/app/modules/global/modal.js' },
    CostCalculator:     { entry: 'global', path: './src/app/modules/global/cost-calculator.js' },

    Sidebar:            { entry: 'sidebar', path: './src/app/modules/global/sidebar.js' },

    // ─────────────────────────────────────────────────────
    // HOME — модули главной страницы
    // ─────────────────────────────────────────────────────
    HeroParticleAssembly: { entry: 'home', path: './src/app/modules/global/hero-particle-assembly.js' },
    OrbitNavigation:      { entry: 'home', path: './src/app/modules/global/orbit-navigation.js' },

    ArchitectureBuilder:  { entry: 'home', path: './src/app/modules/home/architecture-builder.js' },
    AuditEngine:          { entry: 'home', path: './src/app/modules/home/audit-engine.js' },
    Terminal:             { entry: 'home', path: './src/app/modules/home/terminal.js' },
    PipelineScroll:       { entry: 'home', path: './src/app/modules/home/pipeline-scroll.js' },
    SolutionsEngine:      { entry: 'home', path: './src/app/modules/home/solutions-engine.js' },
    SceneRegistry:        { entry: 'home', path: './src/app/modules/home/scene-registry.js' },

    // ─────────────────────────────────────────────────────
    // ABOUT
    // ─────────────────────────────────────────────────────
    AboutIntro:           { entry: 'about', path: './src/app/modules/about/about-intro.js' },

    // ─────────────────────────────────────────────────────
    // SERVICES
    // ─────────────────────────────────────────────────────
    ServicesWheel:        { entry: 'services', path: './src/app/modules/services/services-wheel.js' },

    // ─────────────────────────────────────────────────────
    // CALCULATOR
    // ─────────────────────────────────────────────────────
    CalculatorController: { entry: 'calculator', path: './src/app/modules/calculator/calculator-controller.js' },
}