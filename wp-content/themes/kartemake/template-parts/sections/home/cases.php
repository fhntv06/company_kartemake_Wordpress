<?php
/**
 * Секция: Последние кейсы на главной странице
 *
 * @package KARTEMAKE
 */

// Две последние публикации, кроме featured-кейса.
$latest_query = new WP_Query([
    'post_type'           => 'cases',
//    'post_status'         => 'publish',
    'posts_per_page'      => 4,
    'orderby'             => 'date',
    'order'               => 'DESC',
    'ignore_sticky_posts' => true,
]);

$case_ids = wp_list_pluck($latest_query->posts, 'ID');
$cases_archive_url = get_post_type_archive_link('cases');
if (!$cases_archive_url) {
    $cases_page = get_page_by_path('cases');
    $cases_archive_url = $cases_page ? get_permalink($cases_page) : home_url('/');
}
?>

<section class="scene scene-cases" data-scene="cases">
    <div class="scene-container">
        <header class="scene-header reveal-item">
            <span class="scene-eyebrow">ПРАКТИКА / РЕАЛЬНЫЕ ПРОЕКТЫ</span>
            <h2 class="scene-title">Результат инженерной работы</h2>
            <p class="scene-description">
                Избранные проекты и последние кейсы K·ART·MAKE:
                задачи, технические решения и результат для бизнеса.
            </p>
        </header>

        <?php if (empty($case_ids)) : ?>
            <div class="tag-empty reveal-item">
                <span class="system-label">NO CASES</span>
                <h3>Материалов пока нет.</h3>
                <a href="<?= esc_url($cases_archive_url); ?>" class="button-primary">
                    На страницу блога
                </a>
            </div>
        <?php else: ?>
            <div class="card-articles-grid reveal-item" data-case-latest>
                <?php foreach ($case_ids as $index => $case_id) : ?>
                    <?php
                    $case_id = (int) $case_id;
                    $types = get_the_terms($case_id, 'case_service');
                    $type_names = (!empty($types) && !is_wp_error($types))
                        ? implode(' / ', wp_list_pluck($types, 'name'))
                        : 'CASE';

                    $case_tags = get_the_terms($case_id, 'case_tag');
                    ?>
                    <article class="card-article">
                        <span class="card-article__number">
                            <?= esc_html(str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT)); ?>
                        </span>

                        <div class="card-article__image">
                            <span class="card-article__type">
                                <?= esc_html(mb_strtoupper($type_names)); ?>
                            </span>
                            <a href="<?= esc_url(get_permalink($case_id)); ?>"
                               aria-label="<?= esc_attr(sprintf('Открыть кейс: %s', get_the_title($case_id))); ?>">
                                <?php if (has_post_thumbnail($case_id)) : ?>
                                    <?= get_the_post_thumbnail($case_id, 'large', [
                                        'loading' => 'lazy',
                                        'alt'     => get_the_title($case_id),
                                    ]); ?>
                                <?php endif; ?>
                            </a>
                        </div>

                        <div class="card-article__content">
                            <div class="card-article__meta">
                                <span class="card-article__meta-item">
                                    ПОСЛЕДНИЙ КЕЙС
                                </span>
                                <span class="card-article__meta-item">
                                    <?= esc_html(get_the_date('d M Y', $case_id)); ?>
                                </span>
                            </div>

                            <h4 class="card-article__title">
                                <a href="<?= esc_url(get_permalink($case_id)); ?>">
                                    <?= esc_html(get_the_title($case_id)); ?>
                                </a>
                            </h4>

                            <p class="card-article__description">
                                <?= esc_html(get_the_excerpt($case_id)); ?>
                            </p>

                            <?php if (!empty($case_tags) && !is_wp_error($case_tags)) : ?>
                                <div class="card-article__tags">
                                    <?php foreach ($case_tags as $tag) : ?>
                                        <a href="<?= esc_url(get_term_link($tag)); ?>"
                                           class="card-article__tag">
                                            <?= esc_html($tag->name); ?>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>

                            <a href="<?= esc_url(get_permalink($case_id)); ?>"
                               class="card-article__link">
                                <p>Читать кейс</p>
                                <span class="card-article__link-arrow">↗</span>
                            </a>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
            <div class="reveal-item">
                <a href="<?= esc_url($cases_archive_url); ?>" class="blog-featured-link">
                    <span>Все кейсы</span>
                    <span class="blog-featured-link-arrow">↗</span>
                </a>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php wp_reset_postdata(); ?>
