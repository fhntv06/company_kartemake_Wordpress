<?php
/**
 * ============================================================
 * LEAD FORM HANDLER
 *
 * REST endpoint: POST /wp-json/my/v1/lead
 *
 * Поддерживает несколько форм через поле `form_source`:
 *   - calculator — калькулятор (с конфигурацией и ценой)
 *   - contacts   — форма контактов
 *   - modal      — модалка
 *   - callback   — обратный звонок
 *
 * @package KARTEMAKE
 * ============================================================
 */

defined('ABSPATH') || exit;

class KM_Lead_Form_Handler {

    /* ============================================================
       НАСТРОЙКИ
       ============================================================ */

    /** Максимум файлов */
    const MAX_FILES = 3;

    /** Максимальный размер файла, байт */
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    /** Разрешённые расширения и MIME */
    const ALLOWED_TYPES = [
        'doc'  => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'pdf'  => 'application/pdf',
        'rtf'  => 'application/rtf',
    ];

    /** Человекочитаемые названия источников */
    const SOURCE_LABELS = [
        'calculator' => 'Калькулятор',
        'contacts'   => 'Контакты',
        'modal'      => 'Модалка',
        'callback'   => 'Обратный звонок',
    ];

    /* ============================================================
       INIT
       ============================================================ */

    public static function init(): void {
        add_action('rest_api_init', [__CLASS__, 'register_route']);
    }

    public static function register_route(): void {
        register_rest_route(KM_Lead_CPT::NS, KM_Lead_CPT::ENDPOINT, [
            'methods'             => 'POST',
            'callback'            => [__CLASS__, 'handle'],
            'permission_callback' => '__return_true',
        ]);
    }

    /* ============================================================
       HANDLE
       ============================================================ */

    public static function handle(WP_REST_Request $request) {
        $params = $request->get_params();

        /* ---------- Honeypot ---------- */
        if (!empty($params['_honey'])) {
            return new WP_REST_Response(['message' => 'OK'], 200);
        }

        /* ---------- Yandex SmartCaptcha ---------- */
        $captcha = self::verify_smartcaptcha($params['smart-token'] ?? '');
        if (is_wp_error($captcha)) {
            return new WP_REST_Response(['message' => $captcha->get_error_message()], 403);
        }

        /* ---------- Санитизация ---------- */
        $form_source = sanitize_key($params['form_source'] ?? 'unknown');
        $name        = sanitize_text_field($params['name'] ?? '');
        $contact     = sanitize_text_field($params['contact'] ?? '');
        $message     = sanitize_textarea_field($params['message'] ?? '');
        $consent     = !empty($params['consent']) ? 1 : 0;

        /* ---------- Валидация ---------- */
        $errors = [];
        if ($name === '')    $errors['name']    = 'Укажите имя';
        if ($contact === '') $errors['contact'] = 'Укажите контакт';
        if (!$consent)       $errors['consent'] = 'Необходимо согласие на обработку ПД';

        if ($errors) {
            return new WP_REST_Response([
                'message' => 'Проверьте поля',
                'errors'  => $errors,
            ], 422);
        }

        /* ---------- Метаданные ---------- */
        $meta = [
            'form_source'     => $form_source,
            'name'            => $name,
            'contact'         => $contact,
            'message'         => $message,
            'consent'         => $consent,
            'consent_at'      => current_time('mysql'),
            'consent_ip'      => self::get_client_ip(),
            'consent_version' => 'v1',
        ];

        /* ---------- Поля калькулятора (только для calculator) ---------- */
        if ($form_source === 'calculator') {
            $meta['calculator_task']       = sanitize_text_field($params['calculator_task'] ?? '');
            $meta['calculator_scale']      = sanitize_text_field($params['calculator_scale'] ?? '');
            $meta['calculator_additional'] = sanitize_textarea_field($params['calculator_additional'] ?? '[]');
            $meta['calculator_works']      = sanitize_textarea_field($params['calculator_works'] ?? '[]');
            $meta['calculator_total']      = (int) ($params['calculator_total'] ?? 0);
        }

        /* ---------- Файлы ---------- */
        $uploaded = self::handle_files($request);
        if (!empty($uploaded)) {
            $meta['files'] = implode("\n", $uploaded);
        }

        /* ---------- Создание заявки ---------- */
        $post_id = wp_insert_post([
            'post_type'   => KM_Lead_CPT::SLUG,
            'post_status' => 'private',
            'post_title'  => self::build_title($form_source, $name, $contact),
            'meta_input'  => $meta,
        ]);

        if (!$post_id || is_wp_error($post_id)) {
            error_log('[LEAD] wp_insert_post failed: ' . print_r($post_id, true));
            return new WP_REST_Response(['message' => 'Ошибка сохранения'], 500);
        }

        /* ---------- Письмо ---------- */
        self::send_email($post_id, $form_source, $meta, $uploaded);

        /* ---------- Ответ ---------- */
        return new WP_REST_Response([
            'message' => 'Заявка отправлена',
            'id'      => $post_id,
            'source'  => $form_source,
        ], 200);
    }

    /* ============================================================
       ЗАГОЛОВОК ЗАЯВКИ
       ============================================================ */

    protected static function build_title(string $source, string $name, string $contact): string {
        $label = self::SOURCE_LABELS[$source] ?? 'Форма';
        return "[{$label}] {$name} — {$contact}";
    }

    /* ============================================================
       IP КЛИЕНТА
       ============================================================ */

    protected static function get_client_ip(): string {
        foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = explode(',', $_SERVER[$key])[0];
                return trim($ip);
            }
        }
        return '';
    }

    /* ============================================================
       ФАЙЛЫ
       ============================================================ */

    protected static function handle_files(WP_REST_Request $request): array {
        $uploaded = [];
        $files = $request->get_file_params()['files'] ?? null;

        if (!$files || !is_array($files['name'])) {
            return $uploaded;
        }

        $count = min(count($files['name']), self::MAX_FILES);

        for ($i = 0; $i < $count; $i++) {
            if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;
            if ($files['size'][$i] > self::MAX_FILE_SIZE) continue;

            $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
            if (!isset(self::ALLOWED_TYPES[$ext])) continue;

            $file = [
                'name'     => $files['name'][$i],
                'type'     => self::ALLOWED_TYPES[$ext],
                'tmp_name' => $files['tmp_name'][$i],
                'error'    => $files['error'][$i],
                'size'     => $files['size'][$i],
            ];

            $moved = wp_handle_upload($file, [
                'test_form' => false,
                'mimes'     => self::ALLOWED_TYPES,
            ]);

            if (!isset($moved['error'])) {
                $uploaded[] = $moved['url'];
            } else {
                error_log('[LEAD] File upload failed: ' . $moved['error']);
            }
        }

        return $uploaded;
    }

    /* ============================================================
       ПИСЬМО
       ============================================================ */

    protected static function send_email(int $post_id, string $form_source, array $meta, array $uploaded): void {
        $label = self::SOURCE_LABELS[$form_source] ?? 'Форма';

        /* ---------- Тело письма ---------- */
        $body  = "Источник: {$label}\n\n";
        $body .= "Имя: {$meta['name']}\n";
        $body .= "Контакт: {$meta['contact']}\n";

        if (!empty($meta['message'])) {
            $body .= "Сообщение: {$meta['message']}\n";
        }

        /* Блок конфигурации калькулятора */
        if ($form_source === 'calculator') {
            $body .= "\n— Конфигурация —\n";
            $body .= "Задача: "       . ($meta['calculator_task'] ?? '—')       . "\n";
            $body .= "Масштаб: "      . ($meta['calculator_scale'] ?? '—')      . "\n";
            $body .= "Доп. услуги: "  . ($meta['calculator_additional'] ?? '—') . "\n";
            $body .= "Работы: "       . ($meta['calculator_works'] ?? '—')      . "\n";
            $body .= "Итого: "        . ($meta['calculator_total'] ?? 0) . " ₽\n";
        }

        /* Согласие */
        $body .= "\nСогласие на ПД: " . ($meta['consent'] ? 'да' : 'нет') . "\n";
        $body .= "Дата: {$meta['consent_at']}\n";
        $body .= "IP: {$meta['consent_ip']}\n";

        /* Файлы */
        if (!empty($uploaded)) {
            $body .= "\nФайлы:\n" . implode("\n", $uploaded) . "\n";
        }

        /* Ссылка в админке */
        $body .= "\nЗаявка в админке: " . admin_url("post.php?post={$post_id}&action=edit");

        /* ---------- Тема ---------- */
        $subject = "[{$label}] Новая заявка — {$meta['name']}";

        /* ---------- Вложения ---------- */
        $attachments = array_map(function ($url) {
            return str_replace(content_url(), WP_CONTENT_DIR, $url);
        }, $uploaded);

        /* ---------- Отправка ---------- */
        $sent = wp_mail(
            get_option('admin_email'),
            $subject,
            $body,
            [],
            $attachments
        );

        if (!$sent) {
            error_log("[LEAD] wp_mail failed for post #{$post_id}");
        }
    }

    /* ============================================================
       reCAPTCHA v3 (заготовка)
       ============================================================ */

    protected static function verify_smartcaptcha(string $token) {
        if ($token === '') {
            error_log('[LEAD] SmartCaptcha token missing');
            return new WP_Error('captcha_missing', 'Не пройдена проверка капчи');
        }

        $secret = defined('KM_SMARTCAPTCHA_SERVER_KEY') ? KM_SMARTCAPTCHA_SERVER_KEY : '';
        if ($secret === '') {
            // Ключ не настроен — не блокируем
            return true;
        }

        $ip = self::get_client_ip();

        $response = wp_remote_post('https://smartcaptcha.cloud.yandex.ru/validate', [
            'timeout' => 5,
            'body'    => [
                'secret' => $secret,
                'token'  => $token,
                'ip'     => $ip, // рекомендуется передавать [citation:3][citation:11]
            ],
        ]);

        if (is_wp_error($response)) {
            error_log('[LEAD] SmartCaptcha HTTP error: ' . $response->get_error_message());
            return new WP_Error('captcha_http', 'Ошибка проверки капчи');
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (empty($body['status']) || $body['status'] !== 'ok') {
            error_log('[LEAD] SmartCaptcha fail: ' . print_r($body, true));
            return new WP_Error('captcha_fail', 'Капча не пройдена');
        }

        return true;
    }
}