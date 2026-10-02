<?php
/**
 * K·ART·MAKE — подключение скриптов и стилей.
 *
 * @package KARTMAKE
 */

if (!defined('ABSPATH')) {
    exit;
}

define('KARTEMAKE_MANIFEST_PATH', '/build/manifest.json');

/**
 * Прочитать манифест.
 */
function kartemake_get_manifest() {
    static $manifest = null;

    if ($manifest !== null) {
        return $manifest;
    }

    $path = get_template_directory() . KARTEMAKE_MANIFEST_PATH;

    if (!file_exists($path)) {
        error_log('[kartemake] manifest.json not found: ' . $path);
        $manifest = [];
        return $manifest;
    }

    $data = json_decode(file_get_contents($path), true);

    if (!is_array($data) || empty($data['entrypoints'])) {
        error_log('[kartemake] manifest.json has no entrypoints');
        $manifest = [];
        return $manifest;
    }

    $manifest = $data['entrypoints'];
    return $manifest;
}

/**
 * Преобразовать относительный путь из манифеста в URL.
 */
function kartemake_asset_url($relative) {
    if (preg_match('#^(https?:)?//#', $relative) || str_starts_with($relative, '/')) {
        return $relative;
    }
    return get_template_directory_uri() . '/build/' . ltrim($relative, '/');
}

/**
 * Получить массив ассетов для entry.
 */
function kartemake_get_entry_assets($entry) {
    $manifest = kartemake_get_manifest();
    $assets = $manifest[$entry]['assets'] ?? [];

    return [
        'js'  => array_map('kartemake_asset_url', $assets['js']  ?? []),
        'css' => array_map('kartemake_asset_url', $assets['css'] ?? []),
    ];
}

/**
 * Карта страниц.
 */
function kartemake_get_pages_map() {
    return [
        'home'         => ['type' => 'front'],
        'blog'         => ['type' => 'home'],
        'single'       => ['type' => 'single'],
        'about'        => null,
        'contacts'     => null,
        'calculator'   => null,
        'services'     => null,
        'support'      => null,
        'optimization' => null,
        'modernization'=> null,
        'audit'        => null,
        'pricing'      => null,
        'policy'       => ['pages' => ['privacy-policy', 'cookie-policy']],
        'tag'          => ['type' => 'tag'],          // ← добавили
        'category'     => ['type' => 'category'],     // ← если нужно
        'archive'      => ['type' => 'archive'],      // ← если нужно
        'cases'      => null,
        'error404'      => ['type' => '404'],
    ];
}

/**
 * Проверка правила.
 */
function kartemake_match_page($slug, $rule) {
    if (is_array($rule) && isset($rule['type'])) {
        switch ($rule['type']) {
            case 'front':  return is_front_page();
            case 'home':   return is_home();
            case 'single': return is_single();
            case 'tag':    return is_tag();
            case 'category': return is_category();
            case 'archive':  return is_archive();
            case '404':  return is_404();
        }
        return false;
    }

    if (is_array($rule)) {
        if (!empty($rule['pages'])) {
            foreach ($rule['pages'] as $s) {
                if (is_page($s)) return true;
            }
        }
        if (!empty($rule['templates'])) {
            foreach ($rule['templates'] as $tpl) {
                if (is_page_template($tpl)) return true;
            }
        }
        if (!empty($rule['extra']) && is_callable($rule['extra'])) {
            if (call_user_func($rule['extra'])) return true;
        }
        return false;
    }

    return is_page($slug) || is_page_template("page-{$slug}.php");
}

/**
 * JS-цепочка с порядком.
 */
function kartemake_enqueue_js_chain($prefix, $urls, $version, $skip = []) {
    $prev = null;
    $i = 0;

    foreach ($urls as $url) {
        if (in_array($url, $skip, true)) continue;

        $handle = "{$prefix}-js-{$i}";
        wp_enqueue_script($handle, $url, $prev ? [$prev] : [], $version, true);
        $prev = $handle;
        $i++;
    }
}

/**
 * CSS-цепочка.
 */
function kartemake_enqueue_css_chain($prefix, $urls, $version, $skip = []) {
    $i = 0;

    foreach ($urls as $url) {
        if (in_array($url, $skip, true)) continue;

        wp_enqueue_style("{$prefix}-css-{$i}", $url, [], $version);
        $i++;
    }
}

/**
 * Основная функция.
 */
function kartemake_enqueue_scripts() {
    $version = wp_get_theme()->get('Version');

    // ── 1. Global ────────────────────────────────────────
    $global = kartemake_get_entry_assets('global');
    kartemake_enqueue_js_chain('kartemake-global', $global['js'], $version);
    kartemake_enqueue_css_chain('kartemake-global', $global['css'], $version);

    // ── 2. Страничный entry ──────────────────────────────
    foreach (kartemake_get_pages_map() as $entry => $rule) {
        if (!kartemake_match_page($entry, $rule)) continue;

        $assets = kartemake_get_entry_assets($entry);

        kartemake_enqueue_js_chain("kartemake-{$entry}", $assets['js'], $version, $global['js']);
        kartemake_enqueue_css_chain("kartemake-{$entry}", $assets['css'], $version, $global['css']);

        break;
    }
}
add_action('wp_enqueue_scripts', 'kartemake_enqueue_scripts');