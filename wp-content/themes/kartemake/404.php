<?php
/**
 * Шаблон страницы 404
 * Отображается, когда страница не найдена
 */

get_header();
?>

    <main>
        <section class="error-404">
            <div class="container">
                <div class="error-content">
                    <div class="error-code">404</div>
                    <h1 class="error-title">Страница не найдена</h1>
                    <p class="error-description">
                        К сожалению, страница, которую вы ищете, не существует или была перемещена.
                    </p>

                    <div class="error-actions">
                        <a href="<?php echo home_url('/'); ?>" class="button button--large button--accent">
                            <i class="fas fa-arrow-left"></i>
                            Вернуться на главную
                        </a>
                    </div>

                    <div class="error-suggestions">
                        <p>Вы можете попробовать:</p>
                        <ul>
                            <li><a href="<?php echo home_url('/'); ?>">Перейти на главную страницу</a></li>
                            <li><a href="<?php echo get_permalink(get_option('page_for_posts')); ?>">Посмотреть блог</a></li>
                            <li><a href="<?php echo get_permalink(get_page_by_path('services')); ?>">Наши услуги</a></li>
                            <li><a href="<?php echo get_permalink(get_page_by_path('contacts')); ?>">Связаться с нами</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </main>

<?php get_footer(); ?>