<?php
/**
 * Полное отключение эмодзи для WordPress 4.7+
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Отключаем эмодзи через все возможные хуки
 */
add_action('init', function () {
    // Стандартные хуки
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');

    // Дополнительная очистка для старых версий
    remove_action('wp_head', 'wp_emoji_detection_script', 7);
    remove_action('embed_head', 'print_emoji_detection_script');
}, 10);

/**
 * Принудительно удаляем скрипт через wp_enqueue_scripts
 * Срабатывает позже всех
 */
add_action('wp_enqueue_scripts', function () {
    // Отменяем регистрацию скрипта
    wp_dequeue_script('wp-emoji-release');
    wp_deregister_script('wp-emoji-release');

    // Для старых версий
    wp_dequeue_script('emoji');
    wp_deregister_script('emoji');
}, 999);

/**
 * Перехватываем загрузку скрипта через фильтр src
 * Работает на 100%
 */
add_filter('script_loader_src', function ($src, $handle) {
    // Если это скрипт эмодзи - возвращаем false
    if (strpos($handle, 'emoji') !== false || strpos($src, 'wp-emoji-release') !== false) {
        return false;
    }
    return $src;
}, 999, 2);

/**
 * Удаляем DNS-префетч для s.w.org
 */
add_filter('wp_resource_hints', function ($urls, $relation_type) {
    if ('dns-prefetch' === $relation_type) {
        foreach ($urls as $key => $url) {
            if (strpos($url, 's.w.org') !== false) {
                unset($urls[$key]);
            }
        }
        $urls = array_values($urls);
    }
    return $urls;
}, 999, 2);

/**
 * Удаляем скрипт из HEAD (дополнительная защита)
 */
add_action('wp_head', function () {
    // Удаляем вывод скрипта detection
    remove_action('wp_head', 'wp_emoji_detection_script', 7);
    remove_action('wp_head', 'print_emoji_detection_script', 7);
}, 1);
