<!-- =================================================
GLOBAL DASHBOARD
================================================= -->
<header id="header" class="global-dashboard">
    <div class="dashboard-inner">
        <a href="<?= home_url('/'); ?>" class="dashboard-brand">K·ART·MAKE</a>
        <div class="dashboard-status">
            <span class="dashboard-status-dot"></span>
            СИСТЕМА РАБОТАЕТ
        </div>
        <button class="dashboard-menu" type="button" aria-expanded="false" aria-controls="dashboard-menu-panel">
            <span class="dashboard-menu-label">МЕНЮ</span>
            <span class="dashboard-menu-icon">
                <span></span>
                <span></span>
            </span>
        </button>
    </div>
    <div id="dashboard-menu-panel" class="dashboard-menu-panel" aria-hidden="true">
        <div class="dashboard-menu-panel-inner">
            <!-- CONTACTS -->
            <div class="dashboard-menu-column">
                <span class="dashboard-menu-title">КОНТАКТЫ</span>
                <a href="mailto:hello@kartemake.ru">
                    <span>НОВЫЕ ПРОЕКТЫ</span>
                    <strong>hello@kartemake.ru</strong>
                </a>
                <a href="mailto:support@kartemake.ru">
                    <span>ТЕХНИЧЕСКАЯ ПОДДЕРЖКА</span>
                    <strong>support@kartemake.ru</strong>
                </a>
            </div>
            <!-- SERVICES -->
            <div class="dashboard-menu-column">
                <span class="dashboard-menu-title">УСЛУГИ</span>
                <a href="<?= get_permalink(get_page_by_path('optimization')); ?>">
                    <span>01</span>
                    <strong>Оптимизация сайта</strong>
                </a>
                <a href="<?= get_permalink(get_page_by_path('modernization')); ?>">
                    <span>02</span>
                    <strong>Модернизация</strong>
                </a>
                <a href="<?= get_permalink(get_page_by_path('support')); ?>">
                    <span>03</span>
                    <strong>Техническая поддержка</strong>
                </a>
                <a href="<?= get_permalink(get_page_by_path('audit')); ?>">
                    <span>04</span>
                    <strong>Аудит и консультации</strong>
                </a>
            </div>
            <!-- INFORMATION -->
            <div class="dashboard-menu-column">
                <span class="dashboard-menu-title">ИНФОРМАЦИЯ</span>
                <a href="<?php echo get_permalink(get_page_by_path('about')); ?>">
                    О Компании
                </a>
                <a href="<?php echo get_permalink(get_page_by_path('blog')); ?>">
                    Блог
                </a>
                <a href="<?php echo get_permalink(get_page_by_path('calculator')); ?>">
                    Калькулятор стоимости
                </a>
                <a href="<?php echo get_permalink(get_page_by_path('privacy-policy')); ?>">
                    Политика обработки персональных данных
                </a>
                <a href="<?php echo get_permalink(get_page_by_path('cookie-policy')); ?>">
                    Политика использования Cookie
                </a>
            </div>
        </div>
    </div>
</header>