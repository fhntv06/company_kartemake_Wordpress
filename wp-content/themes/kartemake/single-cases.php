<?php
/**
 * Детальная страница кейса
 *
 * Post type: cases
 * ACF groups:
 * - CASE / Контекст
 * - CASE / Основная информация
 * - CASE / Проблема
 * - CASE / Решение
 * - CASE / Результат
 * - CASE / Технологии
 *
 * @package KARTEMAKE
 */
defined('ABSPATH') || exit;
get_header();
$post_id = get_the_ID();
/**
 * Безопасное получение ACF-поля.
 * ACF может быть отключён — шаблон продолжит работать с данными записи.
 */
$case_field = static function ($name, $default = '') use ($post_id) {
    if (!function_exists('get_field')) {
        return $default;
    }
    $value = get_field($name, $post_id);
    if (is_string($value)) {
        $value = trim($value);
    }
    return ($value !== null && $value !== false && $value !== '')
        ? $value
        : $default;
};
/**
 * Преобразование многострочного поля в массив строк.
 */
$case_lines = static function ($value) {
    if (!is_string($value) || trim($value) === '') {
        return [];
    }
    $lines = preg_split('/\r\n|\r|\n/', $value);
    $lines = array_map('trim', $lines);
    return array_values(array_filter($lines, static function ($line) {
        return $line !== '';
    }));
};
/**
 * Вывод текста из textarea с сохранением абзацев.
 */
$case_text = static function ($value) {
    if (!is_string($value) || trim($value) === '') {
        return '';
    }
    return wpautop(esc_html($value));
};
/**
 * Получаем значения ACF.
 */
// Основная информация
$client       = $case_field('case_client');
$year         = $case_field('case_year');
$short_desc   = $case_field('case_short_description');
$hero_label   = $case_field('case_hero_label', 'CASE STUDY');
$hero_note    = $case_field('case_hero_note');
$duration     = $case_field('case_duration');
$team         = $case_field('case_team');
// Контекст
$context_title   = $case_field('context_title');
$context_text    = $case_field('context_text');
$context_task    = $case_field('context_task');
$context_initial = $case_field('context_initial');
// Проблема
$problem_title  = $case_field('problem_title');
$problem_text   = $case_field('problem_text');
$problem_points = $case_lines($case_field('problem_points'));
// Решение
$solution_title      = $case_field('solution_title');
$solution_text       = $case_field('solution_text');
$solution_actions    = $case_lines($case_field('solution_actions'));
// Технологии
$technology_title = $case_field('technology_title');
$technology_list  = $case_lines($case_field('technology_list'));
$technology_backend = $case_field('technology_backend');
$technology_frontend = $case_field('technology_frontend');
$technology_infrastructure = $case_field('technology_infrastructure');
$technology_database = $case_field('technology_database');
// Результат
$result_title      = $case_field('result_title');
$result_text       = $case_field('result_text');
$result_summary    = $case_field('result_summary');
$result_next_step  = $case_field('result_next_step');
// Таксономия услуг
$service_terms = get_the_terms($post_id, 'case_service');
$service_names = (!empty($service_terms) && !is_wp_error($service_terms))
    ? wp_list_pluck($service_terms, 'name')
    : [];
$service_label = !empty($service_names)
    ? implode(' / ', $service_names)
    : 'CASE STUDY';
// Миниатюра записи
$thumbnail_id = get_post_thumbnail_id($post_id);
$thumbnail_url = $thumbnail_id
    ? wp_get_attachment_image_url($thumbnail_id, 'full')
    : '';
$thumbnail_alt = $thumbnail_id
    ? get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true)
    : '';
if (!$thumbnail_alt) {
    $thumbnail_alt = get_the_title($post_id);
}
// Условия отображения секций
$has_overview = $client || $context_title || $context_text || $context_task || $context_initial;
$has_problem = $problem_title || $problem_text || !empty($problem_points);
$has_solution = $solution_title || $solution_text || !empty($solution_actions);
$has_showcase = $thumbnail_url || trim(get_post_field('post_content', $post_id)) !== '';
$has_technologies = $technology_title || !empty($technology_list)
    || $technology_backend || $technology_frontend
    || $technology_infrastructure || $technology_database;
$has_result = $result_title || $result_text || $result_summary || $result_next_step;
// Навигация по реально доступным секциям
$scene_navigation = [
    [
        'id'    => 'hero',
        'label' => 'Начало',
    ],
];
if ($has_overview) {
    $scene_navigation[] = ['id' => 'case-overview', 'label' => 'Контекст'];
}
if ($has_problem) {
    $scene_navigation[] = ['id' => 'case-approach', 'label' => 'Проблема'];
}
if ($has_solution) {
    $scene_navigation[] = ['id' => 'case-solutions', 'label' => 'Решение'];
}
if ($has_showcase) {
    $scene_navigation[] = ['id' => 'case-showcase', 'label' => 'Проект'];
}
if ($has_technologies) {
    $scene_navigation[] = ['id' => 'case-details', 'label' => 'Технологии'];
}
if ($has_result) {
    $scene_navigation[] = ['id' => 'case-result', 'label' => 'Результат'];
}
$scene_navigation[] = ['id' => 'case-related', 'label' => 'Другие кейсы'];
// Связанные кейсы: сначала того же типа услуги, затем последние опубликованные.
$related_args = [
    'post_type'           => 'cases',
    'post_status'         => 'publish',
    'posts_per_page'      => 2,
    'post__not_in'         => [$post_id],
    'ignore_sticky_posts' => true,
    'orderby'             => 'date',
    'order'               => 'DESC',
];
if (!empty($service_terms) && !is_wp_error($service_terms)) {
    $related_args['tax_query'] = [
        [
            'taxonomy' => 'case_service',
            'field'    => 'term_id',
            'terms'    => wp_list_pluck($service_terms, 'term_id'),
        ],
    ];
}
$related_query = new WP_Query($related_args);
// Если в той же услуге нет других кейсов — показываем последние кейсы сайта.
if (!$related_query->have_posts() && !empty($related_args['tax_query'])) {
    wp_reset_postdata();
    unset($related_args['tax_query']);
    $related_query = new WP_Query($related_args);
}
?>
<?php if (count($scene_navigation) > 2) : ?>
    <!-- ORBIT NAVIGATION -->
    <div id="orbit-navigation" class="orbit-navigation">
        <div class="orbit-circle">
            <?php foreach ($scene_navigation as $index => $scene) : ?>
                <button
                    class="orbit-point"
                    type="button"
                    data-scene="<?= esc_attr($scene['id']); ?>"
                    aria-label="<?= esc_attr($scene['label']); ?>"
                >
                    <span class="orbit-point__description">
                        <?= esc_html($scene['label']); ?>
                    </span>
                    <span></span>
                    <strong>
                        <?= esc_html(str_pad($index + 1, 2, '0', STR_PAD_LEFT)); ?>
                    </strong>
                </button>
            <?php endforeach; ?>
        </div>
    </div>
<?php endif; ?>
    <main class="experience cases-detail-page">
        <!-- =========================================================
             CASE HERO
        ========================================================== -->
        <section
            class="scene scene-hero case-hero"
            data-scene="hero"
            data-canvas-engine
        >
            <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>
            <div class="scene-container">
                <div class="breadcrumbs">
                    <a href="<?= esc_url(home_url('/')); ?>">Главная</a>
                    <span class="breadcrumbs__separator">/</span>
                    <a href="<?= esc_url(get_post_type_archive_link('cases') ?: home_url('/cases/')); ?>">
                        Кейсы
                    </a>
                    <span class="breadcrumbs__separator">/</span>
                    <span class="breadcrumbs__current">
                    <?= esc_html(get_the_title($post_id)); ?>
                </span>
                </div>
                <div class="hero-content">
                    <div class="system-label">
                        K·ART·MAKE / <?= esc_html($hero_label); ?>
                    </div>
                    <h1>
                        <?= esc_html(get_the_title($post_id)); ?>
                    </h1>
                    <?php if ($short_desc) : ?>
                        <p><?= esc_html($short_desc); ?></p>
                    <?php endif; ?>
                    <?php if ($hero_note) : ?>
                        <div class="hero-note">
                            <?= esc_html($hero_note); ?>
                        </div>
                    <?php elseif ($service_label) : ?>
                        <div class="hero-note">
                            <?= esc_html(mb_strtoupper($service_label)); ?>
                        </div>
                    <?php endif; ?>
                    <?php
                    $hero_meta = [];
                    if ($client) {
                        $hero_meta[] = ['label' => 'CLIENT', 'value' => $client];
                    }
                    if ($service_label) {
                        $hero_meta[] = ['label' => 'SERVICE', 'value' => $service_label];
                    }
                    if ($year) {
                        $hero_meta[] = ['label' => 'YEAR', 'value' => $year];
                    }
                    ?>
                    <?php if (!empty($hero_meta)) : ?>
                        <div class="hero-meta">
                            <?php foreach ($hero_meta as $meta) : ?>
                                <span><strong><?= esc_html($meta['value']); ?></strong></span>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </section>
        <!-- =========================================================
             CASE OVERVIEW / CONTEXT
        ========================================================== -->
        <?php if ($has_overview) : ?>
            <section class="scene case-overview" data-scene="case-overview">
                <div class="scene-container">
                    <header class="scene-header reveal-item">
                        <span class="scene-eyebrow">02 / КОНТЕКСТ</span>
                        <h2 class="scene-title">
                            <?= $context_title
                                ? esc_html($context_title)
                                : 'Контекст <span>проекта.</span>'; ?>
                        </h2>
                        <?php if ($context_text) : ?>
                            <p class="scene-description">
                                <?= esc_html($context_text); ?>
                            </p>
                        <?php endif; ?>
                    </header>
                    <div class="case-overview-grid reveal-item">
                        <?php if ($client) : ?>
                            <article class="case-overview-block">
                                <span class="case-overview-label">КЛИЕНТ</span>
                                <h3><?= esc_html($client); ?></h3>
                                <?php if ($context_initial) : ?>
                                    <p><?= esc_html($context_initial); ?></p>
                                <?php endif; ?>
                            </article>
                        <?php endif; ?>
                        <?php if ($context_task) : ?>
                            <article class="case-overview-block">
                                <span class="case-overview-label">ЗАДАЧА КЛИЕНТА</span>
                                <h3><?= esc_html($context_task); ?></h3>
                                <?php if ($context_text) : ?>
                                    <p><?= esc_html($context_text); ?></p>
                                <?php endif; ?>
                            </article>
                        <?php endif; ?>
                        <?php if ($context_initial && $context_task) : ?>
                            <article class="case-overview-block">
                                <span class="case-overview-label">ИСХОДНАЯ СИТУАЦИЯ</span>
                                <h3>С чего начинался проект</h3>
                                <p><?= esc_html($context_initial); ?></p>
                            </article>
                        <?php endif; ?>
                        <?php if ($year || $duration || $team) : ?>
                            <article class="case-overview-block">
                                <span class="case-overview-label">ПАРАМЕТРЫ ПРОЕКТА</span>
                                <?php if ($year) : ?>
                                    <h3><?= esc_html($year); ?></h3>
                                <?php endif; ?>
                                <?php if ($duration) : ?>
                                    <p>Длительность: <?= esc_html($duration); ?></p>
                                <?php endif; ?>
                                <?php if ($team) : ?>
                                    <p>Команда: <?= esc_html($team); ?></p>
                                <?php endif; ?>
                            </article>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>
        <!-- =========================================================
             CASE PROBLEM
             В макете используется сцена case-approach.
        ========================================================== -->
        <?php if ($has_problem) : ?>
            <section class="scene case-approach" data-scene="case-approach">
                <div class="scene-container">
                    <header class="scene-header reveal-item">
                        <span class="scene-eyebrow">03 / ПРОБЛЕМА</span>
                        <h2 class="scene-title">
                            <?= $problem_title
                                ? esc_html($problem_title)
                                : 'Что требовало <span>решения.</span>'; ?>
                        </h2>
                    </header>
                    <div class="case-approach-layout reveal-item">
                        <div class="case-approach-intro">
                            <h3>Описание проблемы</h3>
                            <?php if ($problem_text) : ?>
                                <?= wp_kses_post($problem_text); ?>
                            <?php endif; ?>
                        </div>
                        <?php if (!empty($problem_points)) : ?>
                            <div class="case-approach-list">
                                <?php foreach ($problem_points as $index => $point) : ?>
                                    <article class="case-approach-item">
                                        <span>
                                            <?= esc_html(str_pad($index + 1, 2, '0', STR_PAD_LEFT)); ?>
                                        </span>
                                        <div>
                                            <h4><?= esc_html($point); ?></h4>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <!-- =========================================================
             CASE SOLUTION
        ========================================================== -->
        <?php if ($has_solution) : ?>
            <section class="scene case-solutions" data-scene="case-solutions">
                <div class="scene-container">
                    <header class="scene-header reveal-item">
                        <span class="scene-eyebrow">04 / РЕШЕНИЕ</span>
                        <h2 class="scene-title">
                            <?= $solution_title
                                ? esc_html($solution_title)
                                : 'Как было <span>реализовано решение.</span>'; ?>
                        </h2>
                    </header>

                    <div class="case-approach-layout reveal-item <?= empty($solution_actions) ? 'case-solutions-layout--single' : ''; ?>">
                        <div class="case-approach-intro">
                            <h3>Архитектура решения</h3>

                            <?php if ($solution_text) : ?>
                                <?= wp_kses_post($solution_text); ?>
                            <?php endif; ?>
                        </div>

                        <?php if (!empty($solution_actions)) : ?>
                            <div class="case-approach-list">
                                <?php foreach ($solution_actions as $index => $action) : ?>
                                    <article class="case-approach-item">
                                        <span>
                                            <?= esc_html(str_pad($index + 1, 2, '0', STR_PAD_LEFT)); ?>
                                        </span>
                                        <div>
                                            <h4><?= esc_html($action); ?></h4>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>
        <!-- =========================================================
             CASE SHOWCASE
             Используется миниатюра записи и, при наличии, контент записи.
        ========================================================== -->
        <?php if ($has_showcase) : ?>
            <section class="scene" data-scene="case-showcase">
                <div class="scene-container">
                    <header class="scene-header reveal-item">
                        <span class="scene-eyebrow">05 / ПРОЕКТ</span>
                        <h2 class="scene-title">
                            Проект
                            <span>в деталях.</span>
                        </h2>
                    </header>
                    <?php if ($thumbnail_url) : ?>
                        <div class="case-showcase-main reveal-item">
                            <figure class="blog-detail-cover case-showcase-image">
                                <?= wp_get_attachment_image(
                                    $thumbnail_id,
                                    'full',
                                    false,
                                    [
                                        'alt'      => $thumbnail_alt,
                                        'loading'  => 'lazy',
                                        'decoding' => 'async',
                                    ]
                                ); ?>
                                <figcaption>
                                    <span><?= esc_html(get_the_title($post_id)); ?></span>
                                    <span>K·ART·MAKE / CASE</span>
                                </figcaption>
                            </figure>
                        </div>
                    <?php endif; ?>
                    <?php
                    $case_content = trim(get_post_field('post_content', $post_id));
                    ?>
                    <?php if ($case_content !== '') : ?>
                        <div class="blog-detail-grid reveal-item case-showcase-content" data-toc-main>
                            <!-- SIDEBAR NAV -->
                            <aside id="sidebar" class="sidebar">
                                <nav class="toc" data-toc-links>
                                    <span class="toc-title">СОДЕРЖАНИЕ</span>
                                </nav>
                                <div class="sidebar-actions">
                                    <a href="/" class="button-secondary">← На главную</a>
                                </div>
                            </aside>

                            <div class="blog-detail-body">
                                <?php
                                // Контент редактора WordPress. Применяем стандартные фильтры,
                                // включая блоки Gutenberg и шорткоды.
                                echo apply_filters('the_content', $case_content);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </section>
        <?php endif; ?>
        <!-- =========================================================
             CASE TECHNOLOGIES / PROJECT DETAILS
        ========================================================== -->
        <?php if ($has_technologies) : ?>
            <section class="scene case-details" data-scene="case-details">
                <div class="scene-container">
                    <header class="scene-header reveal-item">
                        <span class="scene-eyebrow">06 / ТЕХНОЛОГИИ</span>
                        <h2 class="scene-title">
                            <?= $technology_title
                                ? esc_html($technology_title)
                                : 'Технологии <span>и инструменты.</span>'; ?>
                        </h2>
                    </header>
                    <div class="case-details-grid reveal-item">
                        <?php if (!empty($technology_list)) : ?>
                            <div class="case-detail">
                                <span class="case-detail-label">ТЕХНОЛОГИИ</span>
                                <strong><?= esc_html(implode(' · ', $technology_list)); ?></strong>
                            </div>
                        <?php endif; ?>
                        <?php if ($technology_backend) : ?>
                            <div class="case-detail">
                                <span class="case-detail-label">BACKEND</span>
                                <strong><?= esc_html($technology_backend); ?></strong>
                            </div>
                        <?php endif; ?>
                        <?php if ($technology_frontend) : ?>
                            <div class="case-detail">
                                <span class="case-detail-label">FRONTEND</span>
                                <strong><?= esc_html($technology_frontend); ?></strong>
                            </div>
                        <?php endif; ?>
                        <?php if ($technology_infrastructure) : ?>
                            <div class="case-detail">
                                <span class="case-detail-label">INFRASTRUCTURE</span>
                                <strong><?= esc_html($technology_infrastructure); ?></strong>
                            </div>
                        <?php endif; ?>
                        <?php if ($technology_database) : ?>
                            <div class="case-detail">
                                <span class="case-detail-label">DATABASE</span>
                                <strong><?= esc_html($technology_database); ?></strong>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>
        <!-- =========================================================
             CASE RESULT
        ========================================================== -->
        <?php if ($has_result) : ?>
            <section class="scene case-result" data-scene="case-result">
                <div class="scene-container">
                    <header class="scene-header reveal-item">
                        <span class="scene-eyebrow">07 / РЕЗУЛЬТАТ</span>
                        <h2 class="scene-title">
                            <?= $result_title
                                ? esc_html($result_title)
                                : 'Что получилось <span>в итоге.</span>'; ?>
                        </h2>
                        <?php if ($result_text) : ?>
                            <p class="scene-description">
                                <?= esc_html($result_text); ?>
                            </p>
                        <?php endif; ?>
                    </header>
                    <?php if ($result_summary) : ?>
                        <div class="case-result-conclusion reveal-item">
                            <span class="case-result-conclusion-label">ИТОГ</span>
                            <div class="case-rich-text">
                                <?= wp_kses_post($result_summary); ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <?php if ($result_next_step) : ?>
                        <div class="case-result-conclusion reveal-item">
                            <span class="case-result-conclusion-label">ДАЛЬШЕ</span>
                            <div class="case-rich-text">
                                <?= wp_kses_post($result_next_step); ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </section>
        <?php endif; ?>
        <!-- =========================================================
             RELATED CASES
        ========================================================== -->
        <section class="scene case-related" data-scene="case-related">
            <div class="scene-container">
                <header class="scene-header reveal-item">
                    <span class="scene-eyebrow">08 / ДРУГИЕ КЕЙСЫ</span>
                    <h2 class="scene-title">
                        Другие
                        <span>проекты.</span>
                    </h2>
                    <p class="scene-description">
                        Другие проекты K·ART·MAKE, в которых технические задачи
                        решались с учётом конкретного контекста бизнеса.
                    </p>
                </header>
                <?php if ($related_query->have_posts()) : ?>
                    <div class="card-articles-grid cases-grid reveal-item">
                        <?php
                        $related_number = 1;
                        while ($related_query->have_posts()) :
                            $related_query->the_post();
                            $related_id = get_the_ID();
                            $related_terms = get_the_terms($related_id, 'case_service');
                            $related_service = (!empty($related_terms) && !is_wp_error($related_terms))
                                ? implode(' / ', wp_list_pluck($related_terms, 'name'))
                                : 'CASE';
                            $related_excerpt = get_the_excerpt();
                            ?>
                            <article class="card-article">
                            <span class="card-article__number">
                                <?= esc_html(str_pad($related_number, 2, '0', STR_PAD_LEFT)); ?>
                            </span>
                                <div class="card-article__image">
                                <span class="card-article__type">
                                    <?= esc_html(mb_strtoupper($related_service)); ?>
                                </span>
                                    <a
                                        href="<?= esc_url(get_permalink()); ?>"
                                        aria-label="<?= esc_attr(get_the_title()); ?>"
                                    >
                                        <?php if (has_post_thumbnail()) : ?>
                                            <?php
                                            the_post_thumbnail('large', [
                                                'loading' => 'lazy',
                                                'alt'     => esc_attr(get_the_title()),
                                            ]);
                                            ?>
                                        <?php else : ?>
                                            <div class="card-article__image-placeholder">
                                                CASE
                                            </div>
                                        <?php endif; ?>
                                    </a>
                                </div>
                                <div class="card-article__content">
                                    <div class="card-article__meta">
                                    <span class="card-article__meta-item">
                                        <?= esc_html(mb_strtoupper($related_service)); ?>
                                    </span>
                                        <span class="card-article__meta-item">
                                        <?= esc_html(get_the_date('d.m.Y')); ?>
                                    </span>
                                    </div>
                                    <h4 class="card-article__title">
                                        <a href="<?= esc_url(get_permalink()); ?>">
                                            <?= esc_html(get_the_title()); ?>
                                        </a>
                                    </h4>
                                    <?php if ($related_excerpt) : ?>
                                        <p class="card-article__description">
                                            <?= esc_html($related_excerpt); ?>
                                        </p>
                                    <?php endif; ?>
                                    <a
                                        href="<?= esc_url(get_permalink()); ?>"
                                        class="card-article__link"
                                    >
                                        <p>Читать кейс</p>
                                        <span class="card-article__link-arrow">↗</span>
                                    </a>
                                </div>
                            </article>
                            <?php
                            $related_number++;
                        endwhile;
                        ?>
                    </div>
                <?php else : ?>
                    <div class="cases-empty reveal-item">
                        <p>Другие кейсы скоро появятся.</p>
                    </div>
                <?php endif; ?>
                <!-- CTA -->
                <div class="cta-block reveal-item">
                    <span>TECHNICAL PARTNER / K·ART·MAKE</span>
                    <h5 class="cta-block__title">
                        Есть техническая задача?
                    </h5>
                    <p class="cta-block__text">
                        Опишите проблему, проект или задачу.
                        Мы разберём техническую часть и предложим
                        оптимальный способ решения.
                    </p>
                    <button
                        class="button-primary"
                        type="button"
                        data-modal-func="open"
                    >
                        Обсудить задачу
                    </button>
                </div>
            </div>
        </section>
    </main>
<?php
/**
 * =====================================================
 * CLEANUP
 * =====================================================
 */
wp_reset_postdata();
get_footer();
