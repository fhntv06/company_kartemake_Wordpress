<?php
defined('ABSPATH') || exit;

require_once __DIR__ . '/forms/class-lead-cpt.php';
require_once __DIR__ . '/forms/class-lead-admin.php';
require_once __DIR__ . '/forms/class-lead-cleanup.php';
require_once __DIR__ . '/forms/class-lead-form-handler.php';

add_action('after_setup_theme', function () {
    KM_Lead_Form_Handler::init();
    KM_Lead_Admin::init();
    KM_Lead_Cleanup::init();
});