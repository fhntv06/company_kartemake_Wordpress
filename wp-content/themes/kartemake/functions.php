<?php
/**
 * Функции темы KARTMAKE
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

// ============================================
// ПОДКЛЮЧЕНИЕ МОДУЛЕЙ
// ============================================

$kartemake_inc = get_template_directory() . '/inc/';

// Инфраструктура
require_once $kartemake_inc . 'disabled-wp-emoji.php';
require_once $kartemake_inc . 'setup.php';
require_once $kartemake_inc . 'menu.php';
require_once $kartemake_inc . 'enqueue.php';

// Функциональность
require_once $kartemake_inc . 'customizer.php';
require_once $kartemake_inc . 'forms.php';
require_once $kartemake_inc . 'controllers.php';

// Хелперы и фильтры
require_once $kartemake_inc . 'helpers.php';
require_once $kartemake_inc . 'body-class.php';
require_once $kartemake_inc . 'excerpt.php';

// Посты и авторы
require_once $kartemake_inc . 'post-meta.php';

// Компонент orbit
require get_template_directory() . '/inc/orbit-navigation.php';