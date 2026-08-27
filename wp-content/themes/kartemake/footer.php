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
<section class="footer-section">
    <div class="scene-container">
        <footer class="contact-footer">
            <!-- FOOTER BRAND -->
            <div class="contact-footer-brand">
                <a href="<?php echo home_url('/'); ?>" class="contact-footer-logo" aria-label="K·ART·MAKE">K·ART·MAKE</a>
                <p><?php echo get_theme_mod('footer_description', 'Технический партнёр для вашего бизнеса.'); ?></p>
            </div>

            <!-- FOOTER NAVIGATION -->
            <nav class="contact-footer-nav" aria-label="Навигация по сайту">
                <div class="contact-footer-column">
                    <span class="contact-footer-title">УСЛУГИ</span>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'services-menu',
                        'menu_class'     => 'footer-menu',
                        'container'      => false,
                        'fallback_cb'    => false,
                        'depth'          => 1,
                    ));
                    ?>
                    <?php if (!has_nav_menu('services-menu')) : ?>
                        <a href="<?php echo home_url('/#optimization'); ?>">Оптимизация сайта</a>
                        <a href="<?php echo home_url('/#modernization'); ?>">Модернизация</a>
                        <a href="<?php echo home_url('/#support'); ?>">Техническая поддержка</a>
                        <a href="<?php echo home_url('/#audit'); ?>">Аудит и консультации</a>
                    <?php endif; ?>
                </div>

                <div class="contact-footer-column">
                    <span class="contact-footer-title">ИНФОРМАЦИЯ</span>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-menu',
                        'menu_class'     => 'footer-menu',
                        'container'      => false,
                        'fallback_cb'    => false,
                        'depth'          => 1,
                    ));
                    ?>
                    <?php if (!has_nav_menu('footer-menu')) : ?>
                        <a href="<?php echo kartmake_get_policy_url('privacy-policy'); ?>">Политика обработки персональных данных</a>
                        <a href="<?php echo kartmake_get_policy_url('cookie-policy'); ?>">Политика использования Cookie</a>
                    <?php endif; ?>
                </div>

                <div class="contact-footer-column">
                    <span class="contact-footer-title">КОНТАКТЫ</span>
                    <a href="mailto:<?php echo get_theme_mod('contact_hello_email', 'hello@kartemake.ru'); ?>">
                        <?php echo get_theme_mod('contact_hello_email', 'hello@kartemake.ru'); ?>
                    </a>
                    <a href="mailto:<?php echo get_theme_mod('contact_support_email', 'support@kartemake.ru'); ?>">
                        <?php echo get_theme_mod('contact_support_email', 'support@kartemake.ru'); ?>
                    </a>
                    <a href="<?php echo get_theme_mod('contact_telegram', 'https://t.me/KArtech76'); ?>" target="_blank">Telegram</a>
                    <a href="<?php echo get_theme_mod('contact_vk', 'https://vk.ru/kartemake'); ?>" target="_blank">VK</a>
                </div>
            </nav>

            <!-- FOOTER BOTTOM -->
            <div class="contact-footer-bottom">
                <span>© <?php echo date('Y'); ?> K·ART·MAKE</span>
                <span>ТЕХНИЧЕСКИЙ ПАРТНЁР</span>
                <span><?php echo get_theme_mod('footer_copyright', 'ВСЕ СИСТЕМЫ РАБОТАЮТ'); ?></span>
            </div>
        </footer>
    </div>
</section>

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
