<?php
/**
 * Фильтры меню: активный класс, очистка классов.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Добавляет класс `active` для текущего пункта меню.
 */
function kartemake_menu_link_attributes($atts, $item, $args) {
  if ($args->theme_location === 'header-menu') {
    if ($item->current || $item->current_item_parent) {
      $atts['class'] = 'active';
    }
  }
  return $atts;
}
add_filter('nav_menu_link_attributes', 'kartemake_menu_link_attributes', 10, 3);

/**
 * Убирает лишние классы у пунктов меню.
 */
function kartemake_menu_css_class($classes, $item, $args) {
  if ($args->theme_location === 'header-menu') {
    return array_filter($classes, function ($class) {
      return !in_array($class, ['menu-item', 'current-menu-item', 'current-page-parent']);
    });
  }
  return $classes;
}
add_filter('nav_menu_css_class', 'kartemake_menu_css_class', 10, 3);