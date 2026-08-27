<!-- =================================================
FOOTER
================================================= -->
<footer class="contact-footer">
    <!-- FOOTER BRAND -->
    <div class="contact-footer-brand">
        <a href="<?php echo home_url('/'); ?>" class="contact-footer-logo" aria-label="K·ART·MAKE">K·ART·MAKE</a>
        <p>Технический партнёр для вашего бизнеса.</p>
    </div>

    <!-- FOOTER NAVIGATION -->
    <nav class="contact-footer-nav" aria-label="Навигация по сайту">
        <div class="contact-footer-column">
            <span class="contact-footer-title">УСЛУГИ</span>
            <a href="<?php echo home_url('/#optimization'); ?>">Оптимизация сайта</a>
            <a href="<?php echo home_url('/#modernization'); ?>">Модернизация</a>
            <a href="<?php echo home_url('/#support'); ?>">Техническая поддержка</a>
            <a href="<?php echo home_url('/#audit'); ?>">Аудит и консультации</a>
        </div>
        <div class="contact-footer-column">
            <span class="contact-footer-title">ИНФОРМАЦИЯ</span>
            <a href="<?php echo get_permalink(get_page_by_path('privacy-policy')); ?>">Политика обработки персональных данных</a>
            <a href="<?php echo get_permalink(get_page_by_path('cookie-policy')); ?>">Политика использования Cookie</a>
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
        <span>© <?php echo date('Y'); ?> K·ART·MAKE</span>
        <span>ТЕХНИЧЕСКИЙ ПАРТНЁР</span>
        <span>ВСЕ СИСТЕМЫ РАБОТАЮТ</span>
    </div>
</footer>