<!-- =================================================
SYSTEM LOADER
================================================= -->

<?php
// Текст зависит от страницы, карта подписей: inc/page-labels.php
$kartemake_labels = kartemake_get_page_labels();
?>

<div class="system-loader">
    <div class="loader-terminal">
        <span><?= esc_html($kartemake_labels['loader']) ?></span>
        <div class="loader-progress">
            <div></div>
        </div>
    </div>
</div>