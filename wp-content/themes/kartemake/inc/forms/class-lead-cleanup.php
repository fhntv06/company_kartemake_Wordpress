<?php
defined('ABSPATH') || exit;

class KM_Lead_Cleanup {

    const CRON_HOOK = 'km_cleanup_leads';
    const TTL_DAYS  = 90;

    public static function init(): void {
        add_action('init', [__CLASS__, 'schedule']);
        add_action(self::CRON_HOOK, [__CLASS__, 'run']);
    }

    public static function schedule(): void {
        if (!wp_next_scheduled(self::CRON_HOOK)) {
            wp_schedule_event(time() + 3600, 'daily', self::CRON_HOOK);
        }
    }

    public static function run(): void {
        $leads = get_posts([
            'post_type'   => KM_Lead_CPT::SLUG,
            'post_status' => 'any',
            'numberposts' => -1,
            'date_query'  => [['before' => self::TTL_DAYS . ' days ago']],
            'fields'      => 'ids',
        ]);

        foreach ($leads as $id) {
            $files = get_post_meta($id, 'files', true);
            if ($files) {
                foreach (explode("\n", $files) as $url) {
                    $url = trim($url);
                    if (!$url) continue;
                    $path = str_replace(content_url(), WP_CONTENT_DIR, $url);
                    if (file_exists($path)) @unlink($path);
                }
            }
            wp_delete_post($id, true);
        }
    }
}
