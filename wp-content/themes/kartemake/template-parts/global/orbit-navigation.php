<!-- =================================================
ORBIT NAVIGATION
================================================= -->
<div id="orbit-navigation" class="orbit-navigation">
    <div class="orbit-circle">
        <?php
        $scenes = array(
            'hero'       => 'Начало',
            'audit'      => 'Диагностика',
            'solutions'  => 'Решения',
            'architecture' => 'Инфраструктура',
            'pipeline'   => 'Процесс',
            'monitoring' => 'Контроль',
            'contact'    => 'Контакты'
        );
        $number = 1;
        foreach ($scenes as $id => $label) : ?>
            <button class="orbit-point" data-scene="<?php echo esc_attr($id); ?>">
                <span class="orbit-point__description"><?php echo esc_html($label); ?></span>
                <span></span>
                <strong><?php echo sprintf('%02d', $number); ?></strong>
            </button>
            <?php $number++;
        endforeach; ?>
    </div>
</div>
