</main>

<footer>
    <div class="footer-content">
        <a class="logo color-whitesmoke" href="<?php echo home_url('/'); ?>">
            <span class="font-size-h2">K</span>
            <span class="font-size-h2">·</span>
            <span class="font-size-h3 color-accent-red">ART</span>
            <span class="font-size-h2">·</span>
            <span class="font-size-h4">MAKE</span>
        </a>

        <div class="footer-info">
            <p><?php echo get_theme_mod('footer_description', 'Ваш внешний технический отдел. Поддержка и развитие digital-продуктов'); ?></p>
        </div>

        <div class="footer-cta">
            <button
                class="cta-button"
                data-controller-modal-open="form"
                data-controller-modal-func="open"
                data-controller-ripple-effect="item"
            >
                Начать проект
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="copyright">
            <?php
            $current_year = date('Y');
            echo get_theme_mod('footer_copyright', "KARTEMAKE © {$current_year}. Все права защищены.");
            ?>
        </div>
    </div>
</footer>

<!-- ============================================ -->
<!-- ВСПОМОГАТЕЛЬНЫЕ БЛОКИ -->
<!-- ============================================ -->

<!-- Overlay -->
<?php get_template_part('template-parts/overlay'); ?>

<!-- Sidebar burger menu -->
<?php get_template_part('template-parts/sidebar-menu'); ?>

<!-- Modal form -->
<?php get_template_part('template-parts/modal-form'); ?>

<!-- Modal showreel -->
<?php get_template_part('template-parts/modal-showreel'); ?>

<!-- Decoration lines -->
<?php get_template_part('template-parts/decoration-lines'); ?>

<!-- Custom cursor -->
<?php get_template_part('template-parts/cursor'); ?>

<!-- Preloader -->
<?php get_template_part('template-parts/preloader'); ?>

<!-- Stars -->
<?php get_template_part('template-parts/stars'); ?>

<!-- Scroll progress -->
<?php get_template_part('template-parts/scroll-progress'); ?>

<!-- Back to top -->
<?php get_template_part('template-parts/back-to-top'); ?>

<!-- Specialist widget -->
<?php get_template_part('template-parts/specialist-widget'); ?>

<?php wp_footer(); ?>
</body>
</html>
