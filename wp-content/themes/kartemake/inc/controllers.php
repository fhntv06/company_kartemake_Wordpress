<?php
/**
 * Управление контроллерами для data-controller на body
 *
 * @package Kartemake
 */

/**
 * Функция возвращает строку с контроллерами для data-controller на body
 */
function kartemake_get_body_controllers() {
    // Базовые контроллеры для всех страниц
    $base_controllers = [
        'custom-cursor',
        'modal',
        'ripple-effect',
        'starfield',
        'theme',
        'anchor',
        'scroll-progress',
    ];

    // Контроллеры для конкретных страниц
    $page_controllers = [];

    // ========== ГЛАВНАЯ СТРАНИЦА ==========
    if (is_front_page()) {
        $page_controllers = [
            'preloader',
            'header',
            'hero-animation',
            'sidebar-anchor',
            'burger-menu',
        ];
    }

    // ========== СТРАНИЦА БЛОГА (список) ==========
    if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
        $page_controllers = [
            'preloader',
            'burger-menu',
            'blog-load-more',
            'blog-search',
            'blog-filter',
        ];
    }

    // ========== ЗАПИСЬ (SINGLE) ==========
    if (is_single()) {
        $page_controllers = [
            'preloader',
            'burger-menu',
            'post-gallery',
            'post-comments',
            'post-share',
        ];
    }

    // ========== СТРАНИЦА УСЛУГ ==========
    if (is_page('services') || is_page_template('page-services.php')) {
        $page_controllers = [
            'preloader',
            'sidebar-anchor',
            'burger-menu',
            'services-filter',
            'services-grid',
            'pricing-calc',
            'particle-animation',
        ];
    }

    // ========== СТРАНИЦА КОНТАКТОВ ==========
    if (is_page('contacts') || is_page_template('page-contacts.php')) {
        $page_controllers = [
            'preloader',
            'burger-menu',
            'contacts-map',
            'contacts-form',
            'yandex-map',
        ];
    }

    // ========== СТРАНИЦА ТЕХПОДДЕРЖКИ ==========
    if (is_page('support') || is_page_template('page-support.php')) {
        $page_controllers = [
            'preloader',
            'burger-menu',
            'support-tickets',
            'support-chat',
            'support-faq',
            'accordion',
        ];
    }

    // ========== СТРАНИЦА 404 ==========
    if (is_404()) {
        $page_controllers = [
            'preloader',
            'burger-menu',
            'error-animation',
        ];
    }

    // Объединяем все контроллеры
    $all_controllers = array_merge($base_controllers, $page_controllers);

    // Удаляем дубли
    $all_controllers = array_unique($all_controllers);

    // Фильтр для расширения контроллеров извне
    $all_controllers = apply_filters('kartemake_body_controllers', $all_controllers);

    // Возвращаем строку для data-controller
    return implode(' ', $all_controllers);
}

/**
 * Проверка, активен ли контроллер на текущей странице
 *
 * @param string $controller_name Название контроллера
 * @return bool
 */
function kartemake_has_controller($controller_name) {
    $controllers = explode(' ', kartemake_get_body_controllers());
    return in_array($controller_name, $controllers);
}
