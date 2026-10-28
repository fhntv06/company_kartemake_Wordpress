/*
=====================================================
K·ART·MAKE V5.2

PAGES MANIFEST

Единственный источник правды о страницах.

Для каждой страницы:
  scss     — файл стилей относительно src/shared/styles/pages/
  modules  — список модулей в registry

Всё остальное (entry-файл, app-класс) генерируется
в webpack.config.js в .webpack/pages/<page>.js
=====================================================
*/

module.exports = {
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

    policy:       { scss: 'policy.scss',       modules: ['Sidebar'] },
    single:       { scss: 'single.scss',       modules: ['Sidebar'] },
    about:        { scss: 'about.scss',        modules: ['AboutIntro'] },
    services:     { scss: 'services.scss',     modules: ['ServicesWheel'] },
    calculator:   { scss: 'calculator.scss',   modules: ['CalculatorController', 'FormHandler'] },
    blog:         { scss: 'blog.scss',         modules: ['Filter'] },
    contacts:     { scss: 'contacts.scss',     modules: ['FormHandler'] },
    support:      { scss: 'support.scss',      modules: [] },
    optimization: { scss: 'optimization.scss', modules: [] },
    modernization:{ scss: 'modernization.scss', modules: [] },
    audit:        { scss: 'audit.scss',        modules: [] },
    auditCompliance152fz:   { scss: 'audit.scss',        modules: ['FormHandler'] },
    cases:        { scss: 'cases.scss',        modules: ['Filter'] },
    casesDetail:  { scss: 'cases-detail.scss', modules: [] },
    tag:          { scss: 'tag.scss',          modules: ['Filter'] },
    pricing:      { scss: 'pricing.scss',      modules: [] },
    error404:     { scss: 'error-404.scss',    modules: ['Filter'] },
    category:     { scss: 'category.scss',     modules: ['Filter'] },
}
