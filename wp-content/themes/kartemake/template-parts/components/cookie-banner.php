<!-- =================================================
COOKIE BANNER
================================================= -->
<div id="cookie-banner" class="cookie-banner" aria-hidden="true">
    <div class="cookie-banner__wrapper">
        <div class="cookie-banner__status">
            <span class="cookie-banner__status-dot"></span>
            <span>PRIVACY / COOKIE CONTROL</span>
        </div>
        <div class="cookie-banner__content">
            <section id="cookie-step-1" class="cookie-step cookie-step--active">
                <div class="cookie-banner__header">
                    <p class="cookie-banner__description">
                        Мы применяем cookies, чтобы сайт работал без сбоев и постоянно становился для вас удобнее.
                    </p>
                </div>
                <div class="cookie-banner__links">
                    <span>Подробнее:</span>
                    <a href="<?php echo get_permalink(get_page_by_path('cookie-policy')); ?>" target="_blank">
                        использование cookie
                    </a>
                    <a href="<?php echo get_permalink(get_page_by_path('privacy-policy')); ?>" target="_blank">
                        обработка персональных данных
                    </a>
                </div>
                <div class="cookie-banner__actions">
                    <button type="button" id="cookie-decline" class="cookie-button cookie-button--outline">
                        Отклонить
                    </button>
                    <button type="button" id="cookie-accept" class="cookie-button cookie-button--accent">
                        Принять
                    </button>
                </div>
            </section>
        </div>
    </div>
</div>