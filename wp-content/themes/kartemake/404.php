<?php
/**
 * Шаблон страницы 404
 *
 * @package KARTMAKE
 */

get_header(); ?>

    <main class="error-404">
        <div class="scene-container">
            <div class="error-content">
                <div class="error-code">
                    <span class="scene-eyebrow">ОШИБКА 404</span>
                    <h1 class="error-title">Страница не найдена</h1>
                </div>

                <div class="error-body">
                    <p class="error-description">
                        Запрашиваемая страница была перемещена, удалена или никогда не существовала.
                        <br>
                        Возможно, вы перешли по устаревшей ссылке или допустили опечатку в адресе.
                    </p>

                    <div class="error-actions">
                        <a href="<?php echo home_url('/'); ?>" class="button-primary">
                            ← На главную
                        </a>
                        <a href="mailto:support@kartemake.ru" class="button-secondary">
                            Сообщить о проблеме
                        </a>
                    </div>
                </div>

                <!-- Похожие страницы -->
                <?php
                $recent_posts = wp_get_recent_posts(array(
                    'numberposts' => 3,
                    'post_status' => 'publish'
                ));
                if (!empty($recent_posts)) : ?>
                    <div class="error-suggestions">
                        <span class="error-suggestions-title">ВОЗМОЖНО, ВАМ ПРИГОДИТСЯ</span>
                        <ul class="error-suggestions-list">
                            <?php foreach ($recent_posts as $post) : ?>
                                <li>
                                    <a href="<?php echo get_permalink($post['ID']); ?>">
                                        <?php echo $post['post_title']; ?>
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
            </div>
        </div>

<?php get_footer(); ?>