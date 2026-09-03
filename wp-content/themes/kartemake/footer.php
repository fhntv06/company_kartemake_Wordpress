<?php
/**
 * Подвал сайта
 *
 * @package Kartemake
 */
?>

    <!-- =================================================
    FOOTER
    ================================================= -->
    <section>
        <div class="scene-container">
            <!-- =================================================
            FOOTER
            ================================================= -->
            <footer class="contact-footer">
                <!-- FOOTER BRAND -->
                <div class="contact-footer-brand">
                    <a href="/" class="contact-footer-logo" aria-label="K·ART·MAKE">K·ART·MAKE</a>
                    <p>Технический партнёр для вашего бизнеса.</p>
                </div>
                <!-- FOOTER NAVIGATION -->
                <nav class="contact-footer-nav" aria-label="Навигация по сайту">
                    <div class="contact-footer-column">
                        <span class="contact-footer-title">УСЛУГИ</span>
                        <a href="<?= get_permalink(get_page_by_path('optimization')) ?>">Оптимизация сайта</a>
                        <a href="<?= get_permalink(get_page_by_path('modernization')) ?>">Модернизация</a>
                        <a href="<?= get_permalink(get_page_by_path('support')) ?>">Техническая поддержка</a>
                        <a href="<?= get_permalink(get_page_by_path('audit')) ?>">Аудит и консультации</a>
                    </div>
                    <div class="contact-footer-column">
                        <span class="contact-footer-title">ИНФОРМАЦИЯ</span>
                        <a href="<?= get_permalink(get_page_by_path('about')); ?>">
                          О Компании
                        </a>
                        <a href="<?= get_permalink(get_page_by_path('blog')); ?>">
                          Блог
                        </a>
                        <a href="<?= get_permalink(get_page_by_path('calculator')); ?>">
                          Калькулятор стоимости
                        </a>
                        <a href="<?= get_permalink(get_page_by_path('contacts')); ?>">
                          Контакты
                        </a>
                        <a href="<?= get_permalink(get_page_by_path('privacy-policy')); ?>">
                          Политика обработки персональных данных
                        </a>
                        <a href="<?= get_permalink(get_page_by_path('cookie-policy')); ?>">
                          Политика использования Cookie
                        </a>
                    </div>
                    <div class="contact-footer-column">
                        <span class="contact-footer-title">КОНТАКТЫ</span>
                        <a href="mailto:hello@kartemake.ru">hello@kartemake.ru</a>
                        <a href="mailto:support@kartemake.ru">support@kartemake.ru</a>
                        <a href="https://t.me/KArtech76">Telegram</a>
                        <a href="https://vk.ru/kartemake">VK</a>
                    </div>
                </nav>
                <!-- FOOTER BOTTOM -->
                <div class="contact-footer-bottom">
                    <span>© 2026 K·ART·MAKE</span>
                    <span>ТЕХНИЧЕСКИЙ ПАРТНЁР</span>
                    <span>ВСЕ СИСТЕМЫ РАБОТАЮТ</span>
                </div>
            </footer>
        </div>
    </section>
</main>

<!-- =================================================
COOKIE BANNER
================================================= -->
<?php get_template_part('template-parts/components/cookie-banner'); ?>

<!-- =================================================
MODAL
================================================= -->
<?php get_template_part('template-parts/components/modal'); ?>

<?php wp_footer(); ?>
</body>
</html>
