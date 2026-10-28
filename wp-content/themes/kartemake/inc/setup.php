<?php
/**
 * Настройки темы: меню, поддержка функций, шаблоны страниц.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Регистрация меню.
 */
function kartemake_register_menus() {
  register_nav_menus([
    'header-menu'   => 'Главное меню в шапке',
    'footer-menu'   => 'Меню блок "Полезное"',
    'privacy-menu'  => 'Правовая информация блок "Полезное"',
    'services-menu' => 'Меню блок "Услуги"',
  ]);
}
add_action('after_setup_theme', 'kartemake_register_menus');

/**
 * Поддержка стандартных фич WordPress.
 */
function kartemake_theme_support() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', [
    'comment-list',
    'comment-form',
    'search-form',
    'gallery',
    'caption',
  ]);
  add_theme_support('post-formats', ['video', 'gallery', 'audio']);
}
add_action('after_setup_theme', 'kartemake_theme_support');

/**
 * Регистрация шаблонов страниц.
 */
function kartemake_page_templates($templates) {
  $templates['page-privacy-policy.php'] = __('Политика использования', 'kartmake');
  $templates['page-cookie-policy.php']  = __('Политика Cookie', 'kartmake');
  return $templates;
}
add_filter('theme_page_templates', 'kartemake_page_templates');

// Подключение smartcaptcha
add_action('wp_footer', function () {
    if (!is_page(['calculator', 'contacts'])) return; // укажи свои слаги
    if (!defined('KM_SMARTCAPTCHA_CLIENT_KEY')) return;

    printf(
        '<script src="https://smartcaptcha.cloud.yandex.ru/captcha.js" defer></script>',
    );
});
add_action('init', function() {
    remove_action('wp_head', 'wp_generator');
});
