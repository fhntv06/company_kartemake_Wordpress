<?php
/**
 * Template Name: Детальная страница "Кейсов"
 * Template Post Type: cases
 *
 * Страница кейсов K·ART·MAKE
 */
get_header();
/**
 * =====================================================
 * CASES SETTINGS
 * =====================================================
 */
$case_post_type = 'cases';
/**
 * Получаем опубликованные кейсы.
 */
$cases_query = new WP_Query([
    'post_type'      => $case_post_type,
    'post_status'    => 'publish',
    'posts_per_page' => -1,
    'orderby'        => 'date',
    'order'          => 'DESC',
    'no_found_rows'  => true,
]);
$cases_count = $cases_query->post_count;
/**
 * Featured Case.
 *
 * Сейчас берём самый свежий опубликованный кейс.
 * Позже можно заменить это на ACF-поле "featured".
 */
$featured_query = new WP_Query([
    'post_type'      => $case_post_type,
    'post_status'    => 'publish',
    'posts_per_page' => 1,
    'orderby'        => 'date',
    'order'          => 'DESC',
    'no_found_rows'  => true,
]);
$featured_case = $featured_query->have_posts()
    ? $featured_query->posts[0]
    : null;
/**
 * =====================================================
 * HELPER: CASE TYPE
 * =====================================================
 *
 * Если позже создадим отдельную таксономию case_type,
 * здесь можно будет заменить текущую логику.
 */
function kartemake_get_case_type($post_id)
{
    $case_type = get_field('case_type', $post_id);
    if (!empty($case_type)) {
        if (is_array($case_type)) {
            return sanitize_title($case_type['value'] ?? $case_type['label'] ?? '');
        }
        return sanitize_title($case_type);
    }
    return '';
}
/**
 * =====================================================
 * HELPER: CASE TYPE LABEL
 * =====================================================
 */
function kartemake_get_case_type_label($post_id)
{
    $case_type = get_field('case_type', $post_id);
    if (is_array($case_type)) {
        return $case_type['label'] ?? '';
    }
    if (!empty($case_type)) {
        $labels = [
            'audit'         => 'AUDIT',
            'optimization'  => 'OPTIMIZATION',
            'modernization' => 'MODERNIZATION',
            'development'   => 'DEVELOPMENT',
            'support'       => 'SUPPORT',
        ];
        $slug = sanitize_title($case_type);
        return $labels[$slug] ?? strtoupper($slug);
    }
    return 'CASE';
}
/**
 * =====================================================
 * HELPER: CASE CLIENT
 * =====================================================
 */
function kartemake_get_case_client($post_id)
{
    $client = get_field('case_client', $post_id);
    return $client ? $client : '—';
}
/**
 * =====================================================
 * HELPER: CASE YEAR
 * =====================================================
 */
function kartemake_get_case_year($post_id)
{
    $year = get_field('case_year', $post_id);
    if ($year) {
        return $year;
    }
    return get_the_date('Y', $post_id);
}
/**
 * =====================================================
 * HELPER: CASE DESCRIPTION
 * =====================================================
 */
function kartemake_get_case_description($post_id)
{
    $description = get_field('case_short_description', $post_id);
    if ($description) {
        return wp_strip_all_tags($description);
    }
    return wp_trim_words(
        get_post_field('post_excerpt', $post_id),
        25,
        '…'
    );
}
/**
 * =====================================================
 * HELPER: CASE TAGS
 * =====================================================
 */
function kartemake_get_case_tags($post_id)
{
    $tags = get_the_terms($post_id, 'post_tag');
    if (!$tags || is_wp_error($tags)) {
        return [];
    }
    return $tags;
}
?>
    <!-- =====================================================
    HERO
    ====================================================== -->
    <section class="scene scene-hero cases-hero" data-scene="hero" data-canvas-engine>
        <canvas
            id="heroCanvas"
            class="hero-canvas"
            aria-hidden="true"
        ></canvas>
        <div class="scene-container">
            <div class="breadcrumbs">
                <a href="<?= esc_url(home_url('/')); ?>">
                    Главная
                </a>
                <span class="breadcrumbs__separator">/</span>
                <span class="breadcrumbs__current">
                Кейсы
            </span>
            </div>
            <div class="hero-content">
                <div class="system-label">
                    K·ART·MAKE / КЕЙСЫ
                </div>
                <h1>
                    Технические <span>решения.</span>
                </h1>
                <p>
                    Реальные проекты, задачи и технические решения:
                    от аудита и оптимизации до разработки,
                    модернизации и технической поддержки.
                </p>
                <div class="hero-note">
                    AUDIT · OPTIMIZATION · MODERNIZATION · DEVELOPMENT · SUPPORT
                </div>
                <div class="hero-meta">
                    <span>PROJECTS</span>
                    <span>
                    <strong>
                        <?= esc_html($cases_count); ?>
                    </strong>
                </span>
                </div>
            </div>
        </div>
    </section>
    <!-- =====================================================
    FEATURED CASE
    ====================================================== -->
    <section class="scene cases-featured" data-scene="cases-featured">
        <div class="scene-container">
            <header class="scene-header reveal-item">
                <div class="scene-eyebrow">
                    ИЗБРАННОЕ / CASE STUDY
                </div>
                <h2 class="scene-title">
                    Проект,
                    <span>который показывает подход</span>
                </h2>
                <p class="scene-description">
                    Разбираем реальную техническую задачу:
                    контекст проекта, принятые решения,
                    процесс работы и результат.
                </p>
            </header>
            <?php if ($featured_case) : ?>
                <?php
                $featured_id = $featured_case->ID;
                $featured_title = get_the_title($featured_id);
                $featured_url   = get_permalink($featured_id);
                $featured_type       = kartemake_get_case_type_label($featured_id);
                $featured_client     = kartemake_get_case_client($featured_id);
                $featured_year       = kartemake_get_case_year($featured_id);
                $featured_description = kartemake_get_case_description($featured_id);
                $featured_image = get_the_post_thumbnail(
                    $featured_id,
                    'large',
                    [
                        'loading' => 'lazy',
                    ]
                );
                $featured_tags = kartemake_get_case_tags($featured_id);
                ?>
                <div class="cases-featured-layout reveal-item">
                    <!-- FEATURED VISUAL -->
                    <article class="cases-featured-visual">
                        <a
                            href="<?= esc_url($featured_url); ?>"
                            class="cases-featured-image"
                            aria-label="<?= esc_attr('Открыть кейс: ' . $featured_title); ?>"
                        >
                            <?php if ($featured_image) : ?>
                                <?= $featured_image; ?>
                            <?php else : ?>
                                <div class="cases-featured-image-placeholder">
                                    CASE / K·ART·MAKE
                                </div>
                            <?php endif; ?>
                        </a>
                        <div class="cases-featured-status">
                            FEATURED / CASE
                        </div>
                        <div class="cases-featured-visual-content">
                        <span class="cases-featured-category">
                            <?= esc_html($featured_type); ?>
                        </span>
                            <h3>
                                <a href="<?= esc_url($featured_url); ?>">
                                    <?= esc_html($featured_title); ?>
                                </a>
                            </h3>
                        </div>
                    </article>
                    <!-- FEATURED CONTENT -->
                    <div class="cases-featured-content">
                        <div class="cases-featured-meta">
                            <div class="cases-featured-meta-item">
                            <span class="cases-featured-meta-label">
                                CLIENT
                            </span>
                                <span class="cases-featured-meta-value">
                                <?= esc_html($featured_client); ?>
                            </span>
                            </div>
                            <div class="cases-featured-meta-item">
                            <span class="cases-featured-meta-label">
                                TYPE
                            </span>
                                <span class="cases-featured-meta-value">
                                <?= esc_html($featured_type); ?>
                            </span>
                            </div>
                            <div class="cases-featured-meta-item">
                            <span class="cases-featured-meta-label">
                                YEAR
                            </span>
                                <span class="cases-featured-meta-value">
                                <?= esc_html($featured_year); ?>
                            </span>
                            </div>
                        </div>
                        <?php if ($featured_description) : ?>
                            <p class="cases-featured-description">
                                <?= esc_html($featured_description); ?>
                            </p>
                        <?php endif; ?>
                        <?php if (!empty($featured_tags)) : ?>
                            <div class="cases-featured-tags">
                                <?php foreach ($featured_tags as $tag) : ?>
                                    <a
                                        href="<?= esc_url(get_term_link($tag)); ?>"
                                        class="cases-featured-tag"
                                    >
                                        <?= esc_html($tag->name); ?>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                        <a
                            href="<?= esc_url($featured_url); ?>"
                            class="cases-featured-link"
                        >
                        <span>
                            Смотреть кейс
                        </span>
                            <span class="cases-featured-link-arrow">
                            ↗
                        </span>
                        </a>
                    </div>
                </div>
            <?php else : ?>
                <div class="cases-empty reveal-item">
                    <p>
                        Кейсы пока не опубликованы.
                    </p>
                </div>
            <?php endif; ?>
        </div>
    </section>
    <!-- =====================================================
    CASES ARCHIVE
    ====================================================== -->
    <section class="scene cases-archive" data-scene="cases-archive">
        <div class="scene-container">
            <header class="scene-header reveal-item">
                <div class="scene-eyebrow">
                    АРХИВ / PROJECTS
                </div>
                <h2 class="scene-title">
                    Реальные проекты
                    <span>и техническая практика</span>
                </h2>
                <p class="scene-description">
                    Кейсы показывают не только итоговый продукт,
                    но и задачу, процесс работы, технические решения
                    и полученный результат.
                </p>
            </header>
            <!-- =================================================
            FILTER
            ================================================== -->
            <div
                class="filter reveal-item"
                role="navigation"
                aria-label="Фильтр кейсов"
            >
                <button
                    class="filter__item is-active"
                    type="button"
                    data-filter="all"
                    aria-pressed="true"
                >
                    Все
                </button>
                <button
                    class="filter__item"
                    type="button"
                    data-filter="audit"
                    aria-pressed="false"
                >
                    Аудит
                </button>
                <button
                    class="filter__item"
                    type="button"
                    data-filter="optimization"
                    aria-pressed="false"
                >
                    Оптимизация
                </button>
                <button
                    class="filter__item"
                    type="button"
                    data-filter="modernization"
                    aria-pressed="false"
                >
                    Модернизация
                </button>
                <button
                    class="filter__item"
                    type="button"
                    data-filter="development"
                    aria-pressed="false"
                >
                    Разработка
                </button>
                <button
                    class="filter__item"
                    type="button"
                    data-filter="support"
                    aria-pressed="false"
                >
                    Поддержка
                </button>
            </div>
            <!-- =================================================
            CASES GRID
            ================================================== -->
            <div class="card-articles-grid reveal-item">
                <?php if ($cases_query->have_posts()) : ?>
                    <?php
                    $case_number = 1;
                    while ($cases_query->have_posts()) :
                        $cases_query->the_post();
                        $case_id = get_the_ID();
                        $case_title       = get_the_title();
                        $case_url         = get_permalink();
                        $case_type        = kartemake_get_case_type($case_id);
                        $case_type_label  = kartemake_get_case_type_label($case_id);
                        $case_description = kartemake_get_case_description($case_id);
                        $case_image = get_the_post_thumbnail(
                            $case_id,
                            'large',
                            [
                                'loading' => 'lazy',
                            ]
                        );
                        $case_tags = kartemake_get_case_tags($case_id);
                        /**
                         * Дата публикации.
                         */
                        $case_date = get_the_date(
                            'd M Y',
                            $case_id
                        );
                        ?>
                        <!-- =================================================
                        CASE
                        ================================================== -->
                        <article
                            class="card-article"
                            data-filter-type="<?= esc_attr($case_type); ?>"
                        >
                        <span class="card-article__number">
                            <?php
                            echo esc_html(
                                str_pad(
                                    $case_number,
                                    2,
                                    '0',
                                    STR_PAD_LEFT
                                )
                            );
                            ?>
                        </span>
                            <div class="card-article__image">
                            <span class="card-article__type">
                                CASE
                            </span>
                                <a
                                    href="<?= esc_url($case_url); ?>"
                                    aria-label="<?= esc_attr($case_title); ?>"
                                >
                                    <?php if ($case_image) : ?>
                                        <?= $case_image; ?>
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
                                    <?php
                                    echo esc_html($case_type_label);
                                    ?>
                                </span>
                                    <span class="card-article__meta-item">
                                    <?php
                                    echo esc_html($case_date);
                                    ?>
                                </span>
                                </div>
                                <h4 class="card-article__title">
                                    <a href="<?= esc_url($case_url); ?>">
                                        <?php
                                        echo esc_html($case_title);
                                        ?>
                                    </a>
                                </h4>
                                <?php if ($case_description) : ?>
                                    <p class="card-article__description">
                                        <?php
                                        echo esc_html($case_description);
                                        ?>
                                    </p>
                                <?php endif; ?>
                                <?php if (!empty($case_tags)) : ?>
                                    <div class="card-article__tags">
                                        <?php foreach ($case_tags as $tag) : ?>
                                            <a
                                                href="<?= esc_url(get_term_link($tag)); ?>"
                                                class="card-article__tag"
                                            >
                                                <?php
                                                echo esc_html($tag->name);
                                                ?>
                                            </a>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                                <a
                                    href="<?= esc_url($case_url); ?>"
                                    class="card-article__link"
                                >
                                    <p>
                                        Читать кейс
                                    </p>
                                    <span class="card-article__link-arrow">
                                    ↗
                                </span>
                                </a>
                            </div>
                        </article>
                        <?php
                        $case_number++;
                    endwhile;
                    ?>
                <?php else : ?>
                    <div class="cases-empty">
                        <p>
                            Кейсы пока не опубликованы.
                        </p>
                    </div>
                <?php endif; ?>
            </div>
            <!-- =================================================
            CTA
            ================================================== -->
            <div class="cta-block reveal-item">
            <span>
                TECHNICAL PARTNER / K·ART·MAKE
            </span>
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
<?php
/**
 * =====================================================
 * CLEANUP
 * =====================================================
 */
wp_reset_postdata();
get_footer();
