<?php
/**
 * Шаблон страницы 404
 *
 * @package KARTMAKE
 */

get_header(); ?>

  <main>
    <section class="scene scene-hero error-404" data-scene="hero" data-canvas-engine>
      <canvas id="heroCanvas" class="hero-canvas" aria-hidden="true"></canvas>
      <div class="scene-container">
        <div class="hero-content">
          <div class="system-label">ОШИБКА 404</div>
          <h1>Страница <span>не найдена</span></h1>
          <p>
            Запрашиваемая страница была перемещена, удалена или никогда не существовала.
            <br>
            Возможно, вы перешли по устаревшей ссылке или допустили опечатку в адресе.
          </p>
          <div class="hero-note">DEVELOPMENT · SUPPORT · AUDIT · INFRASTRUCTURE</div>
          <div class="hero-actions">
            <a href="<?php echo home_url('/'); ?>" class="button-primary">
              ← На главную
            </a>
            <a href="mailto:support@kartemake.ru" class="button-secondary">
              Сообщить о проблеме
            </a>
          </div>
        </div>

          <!-- Похожие страницы -->
          <?php
          $recent_posts = wp_get_recent_posts(array(
              'numberposts' => 3,
              'post_status' => 'publish'
          ));
          if (!empty($recent_posts)) : ?>
            <div class="error-suggestions">
              <span class="error-suggestions-title">ВОЗМОЖНО, ВАМ ПРИГОДИТСЯ</span>
              <ul class="error-suggestions-list">
              <?php foreach ($recent_posts as $post): ?>
                <li>
                  <a href="<?= get_permalink($post['ID']) ?>">
                      <?= $post['post_title'] ?>
                  </a>
                </li>
              <?php endforeach; ?>
              </ul>
            </div>
          <?php endif; ?>
        </div>
    </section>

<?php get_footer(); ?>

