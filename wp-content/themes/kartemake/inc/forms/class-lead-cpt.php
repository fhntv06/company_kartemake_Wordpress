<?php
defined('ABSPATH') || exit;

class KM_Lead_CPT {
    const SLUG           = 'lead';
    const NS             = 'my/v1';
    const ENDPOINT       = '/lead';
    const MAX_FILES      = 3;
    const MAX_FILE_SIZE  = 5 * 1024 * 1024;
}
