<?php
/**
 * Настройки excerpt для блога.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Кастомная длина excerpt.
 */
function kartemake_excerpt_length($length) {
  if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
    return 25;
  }
  return $length;
}
add_filter('excerpt_length', 'kartemake_excerpt_length', 999);

/**
 * Кастомное "Читать далее".
 */
function kartemake_excerpt_more($more) {
  if (is_home() || is_page('blog') || is_page_template('page-blog.php')) {
    return '...';
  }
  return $more;
}
add_filter('excerpt_more', 'kartemake_excerpt_more');