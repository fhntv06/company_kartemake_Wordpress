<?php
/**
 * Компонент заголовка секции
 *
 * @param string $eyebrow   - Метка секции
 * @param string $title     - Заголовок
 * @param string $description - Описание
 * @param string $classes   - Дополнительные классы
 */
?>

<header class="scene-header <?php echo esc_attr($args['classes'] ?? ''); ?> reveal-item">
    <?php if (!empty($args['eyebrow'])) : ?>
        <span class="scene-eyebrow"><?php echo esc_html($args['eyebrow']); ?></span>
    <?php endif; ?>

    <?php if (!empty($args['title'])) : ?>
        <h2 class="scene-title"><?php echo wp_kses_post($args['title']); ?></h2>
    <?php endif; ?>

    <?php if (!empty($args['description'])) : ?>
        <p class="scene-description"><?php echo wp_kses_post($args['description']); ?></p>
    <?php endif; ?>
</header>