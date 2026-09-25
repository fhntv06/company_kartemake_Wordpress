/*
=====================================================
K·ART·MAKE V5.2

MODULES MANIFEST

Реестр модулей: имя в window.App → путь к файлу.
Пути — относительно корня проекта.
=====================================================
*/

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
