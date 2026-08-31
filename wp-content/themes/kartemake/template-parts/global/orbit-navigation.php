<!-- =================================================
ORBIT NAVIGATION
================================================= -->
<div id="orbit-navigation" class="orbit-navigation">
    <div class="orbit-circle">
        <?php
        $scenes = [];

        if (is_front_page()) {
            $scenes = [
                'hero'       => 'Начало',
                'audit'      => 'Диагностика',
                'solutions'  => 'Решения',
                'architecture' => 'Инфраструктура',
                'pipeline'   => 'Процесс',
                'monitoring' => 'Контроль',
                'contact'    => 'Контакты',
            ];
        }

        if (is_page('about')) {
            $scenes = [
                'hero'       => 'Начало',
                'about-intro'      => 'Мы',
                'about-model'  => 'Модель',
                'about-team' => 'Команда',
                'about-philosophy'   => 'Философия',
                'about-contact' => 'Контакты',
            ];
        }

        if (is_page('blog')) {
            $scenes = [
                'hero'       => 'Начало',
                'blog-intro'       => 'Знания',
                'blog-featured'       => 'Избранное',
                'blog-articles'       => 'Архив',
            ];
        }

        if (is_page('calculator')) {
            $scenes = [
                'hero'       => 'Начало',
                'calculator-intro'       => 'Как формируется стоимость',
                'calculator-scene'       => 'Рассчитайте стоимость',
                'calculator-contact'       => 'Готовы обсудить задачу?',
            ];
        }

        if (empty($scenes)) return;

        $number = 1;
        foreach ($scenes as $id => $label) : ?>
            <button class="orbit-point" data-scene="<?= esc_attr($id); ?>">
                <span class="orbit-point__description"><?= esc_html($label); ?></span>
                <span></span>
                <strong><?= sprintf('%02d', $number); ?></strong>
            </button>
            <?php $number++;
        endforeach; ?>
    </div>
</div>
