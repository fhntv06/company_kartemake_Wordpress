<div id="form" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Хотите чтобы мы решили <span class="color-accent-red">ваш кейс</span>?</h3>
            <p>Оставьте заявку и наш специалист свяжется с вами для обсуждения деталей вашего проекта</p>
        </div>

        <!-- Секция с формой -->
        <div class="form-container">
            <form class="contact-form" data-controller="form" method="POST" action="<?php echo admin_url('admin-post.php'); ?>">
                <?php wp_nonce_field('kartemake_form_submit', 'kartemake_nonce'); ?>
                <input type="hidden" name="action" value="kartemake_submit_form">

                <div class="form-group">
                    <input type="text" class="form-input" id="name" name="name" placeholder=" " required>
                    <label for="name" class="form-label">Имя</label>
                </div>

                <div class="form-group">
                    <input type="text" class="form-input" id="company" name="company" placeholder=" ">
                    <label for="company" class="form-label">Название компании</label>
                </div>

                <div class="form-group">
                    <input type="email" class="form-input" id="email" name="email" placeholder=" " required>
                    <label for="email" class="form-label">Email</label>
                </div>

                <div class="form-group">
                    <input type="tel" class="form-input" id="phone" name="phone" placeholder=" " required>
                    <label for="phone" class="form-label">Телефон</label>
                </div>

                <div class="form-group full-width">
                    <textarea class="form-input" id="message" name="message" placeholder=" " required></textarea>
                    <label for="message" class="form-label">Расскажите о вашем проекте</label>
                </div>

                <div class="form-button">
                    <button
                        class="cta-button"
                        type="submit"
                        data-controller-ripple-effect="item"
                    >
                        Отправить
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>

                <p class="form-notice">Нажимая на кнопку, вы соглашаетесь с
                    <a href="<?php echo get_privacy_policy_url(); ?>">политикой конфиденциальности</a>
                </p>
            </form>
        </div>
    </div>
    <div class="close-modal" data-controller-modal-func="close">
        <i class="fas fa-times"></i>
    </div>
</div>