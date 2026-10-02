<?php
defined('ABSPATH') || exit;

class KM_Lead_Admin {

    public static function init(): void {
        add_action('add_meta_boxes', [__CLASS__, 'register_meta_boxes']);
        add_filter('upload_mimes', [__CLASS__, 'allow_rtf']);
    }

    public static function register_meta_boxes(): void {
        add_meta_box(
            'lead_files',
            'Прикреплённые файлы',
            [__CLASS__, 'render_files_box'],
            KM_Lead_CPT::SLUG,
            'side',
            'default'
        );
    }

    public static function render_files_box($post): void {
        $files = get_post_meta($post->ID, 'files', true);
        if (!$files) {
            echo '<p>Файлов нет.</p>';
            return;
        }

        $urls = array_filter(array_map('trim', explode("\n", $files)));
        echo '<ul>';
        foreach ($urls as $url) {
            echo '<li><a href="' . esc_url($url) . '" target="_blank">'
                . esc_html(basename($url)) . '</a></li>';
        }
        echo '</ul>';
    }

    public static function allow_rtf($mimes): array {
        $mimes['rtf'] = 'application/rtf';
        return $mimes;
    }
}
