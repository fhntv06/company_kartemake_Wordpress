<!-- =================================================
SYSTEM LOADER
================================================= -->

<?php
$textLoader = 'ЗАПУСК СИСТЕМЫ K·ART·MAKE';

if (is_page('privacy-policy') || is_page('cookie-policy')) {
    $textLoader = 'ЗАГРУЗКА ДОКУМЕНТА';
}
?>

<div class="system-loader">
    <div class="loader-terminal">
        <span><?= $textLoader ?></span>
        <div class="loader-progress">
            <div></div>
        </div>
    </div>
</div>
