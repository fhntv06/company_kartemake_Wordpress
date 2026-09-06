<?php

/**
 * K·ART·MAKE — WordPress Security Hardening
 *
 * Ограничение публичного REST API endpoint пользователей.
 */

add_filter('rest_endpoints', function ($endpoints) {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users']);
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }

    return $endpoints;
});

/**
 * Security Headers
 */

add_action('send_headers', function () {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
});

/**
 * Полное отключение XML-RPC.
 */
add_filter('xmlrpc_enabled', '__return_false');

add_filter('xmlrpc_methods', function ($methods) {
    return [];
});
