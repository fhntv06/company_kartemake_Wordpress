<?php
/**
 * Хелперы и утилиты.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Получить ID страницы по пути.
 */
function kartemake_get_page_id_by_path($path) {
  $page = get_page_by_path($path);
  return $page ? $page->ID : 0;
}

/**
 * Получить URL страницы политики.
 */
function kartemake_get_policy_url($type = 'privacy-policy') {
  $page_id = kartemake_get_page_id_by_path($type);
  if ($page_id) {
    return get_permalink($page_id);
  }
  return home_url('/' . $type . '/');
}

/**
 * Получить время чтения записи.
 */
function kartemake_get_reading_time($post_id = null) {
  $post_id = $post_id ?: get_the_ID();
  $reading_time = get_post_meta($post_id, 'reading_time', true);
  if ($reading_time === '') {
    return '';
  }
  return (string) absint($reading_time) . ' мин';
}

/**
 * Получить количество просмотров записи.
 */
function kartemake_get_post_views($post_id = null) {
  $post_id = $post_id ?: get_the_ID();
  return absint(get_post_meta($post_id, 'post_views', true));
}

/**
 * Получить должность автора.
 */
function kartemake_get_author_position($user_id = null) {
  $user_id = $user_id ?: get_the_author_meta('ID');
  return (string) get_user_meta($user_id, 'position', true);
}