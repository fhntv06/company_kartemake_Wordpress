<?php
/**
 * Мета-поля для записей блога.
 *
 * @package Kartemake
 */

if (!defined('ABSPATH')) {
  exit;
}

// ─── Регистрация метабокса ───────────────────────────────

add_action('add_meta_boxes', 'kartemake_add_post_meta_boxes');

function kartemake_add_post_meta_boxes() {
  add_meta_box(
    'kartemake_post_meta',
    'Дополнительные настройки поста',
    'kartemake_post_meta_callback',
    'post',
    'side',
    'default'
  );
}

function kartemake_post_meta_callback($post) {
  wp_nonce_field('kartemake_post_meta', 'kartemake_post_meta_nonce');

  $reading_time = get_post_meta($post->ID, 'reading_time', true);
  $reading_time = $reading_time === '0' ? 1 : $reading_time;
  $views = get_post_meta($post->ID, 'post_views', true);
  $views = $views === '0' ? 1 : $views;
  ?>
  <p>
    <label for="reading_time">Время чтения (минут):</label>
    <input type="number" id="reading_time" name="reading_time" value="<?= esc_attr($reading_time); ?>" style="width: 100%;">
  </p>
  <p>
    <label for="post_views">Количество просмотров:</label>
    <input type="number" id="post_views" name="post_views" value="<?= esc_attr($views); ?>" style="width: 100%;">
  </p>
  <?php
}

// ─── Сохранение ───────────────────────────────────────────

add_action('save_post_post', 'kartemake_save_post_meta');

function kartemake_save_post_meta($post_id) {
  if (
    !isset($_POST['kartemake_post_meta_nonce']) ||
    !wp_verify_nonce($_POST['kartemake_post_meta_nonce'], 'kartemake_post_meta')
  ) {
    return;
  }

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (!current_user_can('edit_post', $post_id)) {
    return;
  }

  if (isset($_POST['reading_time'])) {
    $reading_time = $_POST['reading_time'];
    update_post_meta($post_id, 'reading_time', absint($reading_time === '0' ? 1 : $reading_time));
  }

  if (isset($_POST['post_views'])) {
    $post_views = $_POST['reading_time'];
    update_post_meta($post_id, 'post_views', absint($post_views === '0' ? 1 : $post_views));
  }
}
// ─── Сохранение ───────────────────────────────────────────
add_action( 'show_user_profile', 'extra_user_profile_fields' );
add_action( 'edit_user_profile', 'extra_user_profile_fields' );

function extra_user_profile_fields( $user ) {
?>
  <h3>Дополнительная информация</h3>
  <table class="form-table">
    <tr>
      <th><label for="position">Должность</label></th>
      <td>
        <input type="text" name="position" id="position" value="<?= esc_attr( get_the_author_meta( 'position', $user->ID ) ); ?>" class="regular-text" /><br />
        <span class="description">Введите должность</span>
      </td>
    </tr>
  </table>
<?php
}

add_action( 'personal_options_update', 'save_extra_user_profile_fields' );
add_action( 'edit_user_profile_update', 'save_extra_user_profile_fields' );

function save_extra_user_profile_fields( $user_id ) {
  if ( ! current_user_can( 'edit_user', $user_id ) ) {
    return false;
  }
  update_user_meta( $user_id, 'position', sanitize_text_field( $_POST['position'] ) );
}



