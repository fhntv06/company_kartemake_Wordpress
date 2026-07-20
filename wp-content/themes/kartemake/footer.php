</main>

<footer class="footer">
    <div class="container">
        <!-- Строка 1: Лого + 3 колонки + CTA -->
        <div class="footer__row footer__row--top">
            <!-- Колонка 1: Логотип -->
            <div class="footer__col footer__col--logo">
                <a href="<?php echo home_url('/'); ?>" class="logo">
                    <span class="font-size-h3">K</span>
                    <span class="font-size-h3">·</span>
                    <span class="font-size-h4 color-accent-red">ART</span>
                    <span class="font-size-h3">·</span>
                    <span class="font-size-h5">MAKE</span>
                </a>

                <!-- Информация о компании -->
<!--                <div class="footer__company">-->
<!--                    <p class="footer__company-name">ИП [ФИО]</p>-->
<!--                    <p class="footer__company-inn">ИНН: [ИНН]</p>-->
<!--                    <p class="footer__company-ogrn">ОГРНИП: [ОГРНИП]</p>-->
<!--                </div>-->
            </div>

            <!-- Колонка 2: Услуги -->
            <div class="footer__col footer__col--services">
                <h4 class="footer__title">Услуги</h4>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'services-menu',
                    'container'      => false,
                    'menu_class'     => 'footer__list',
                    'fallback_cb'    => false,
                    'depth'          => 1,
                    'echo'           => true,
                ));
                ?>
            </div>

            <!-- Колонка 3: Полезное (динамическое меню) -->
            <div class="footer__col footer__col--links">
                <h4 class="footer__title">Полезное</h4>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer-menu',
                    'container'      => false,
                    'menu_class'     => 'footer__list',
                    'fallback_cb'    => false,
                    'depth'          => 1,
                    'echo'           => true,
                ));
                ?>
                <div class="footer__list-divider"></div>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'privacy-menu',
                    'container'      => false,
                    'menu_class'     => 'footer__list',
                    'fallback_cb'    => false,
                    'depth'          => 1,
                    'echo'           => true,
                ));
                ?>
            </div>

            <!-- Колонка 4: Контакты + Соцсети -->
            <div class="footer__col footer__col--contacts">
                <h4 class="footer__title">Контакты</h4>

                <ul class="footer__list footer__list--contacts">
                    <li>
                        <i class="fas fa-phone"></i>
                        <a href="tel:+79089461483">+7 (908) 946-14-83</a>
                    </li>
                    <li>
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:hello@kartemake.ru">hello@kartemake.ru</a>
                    </li>
                    <!--            <li>-->
                    <!--              <i class="fas fa-map-marker-alt"></i>-->
                    <!--              <span>г. Москва, ул. Тверская, д. 1</span>-->
                    <!--            </li>-->
                </ul>

                <!-- Социальные сети -->
                <div class="footer__social">
                    <a href="https://vk.ru/kartemake" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте">
                        <i class="fab fa-vk"></i>
                    </a>
                    <a href="https://t.me/KArtech76" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                        <i class="fab fa-telegram-plane"></i>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Дзен">
                        <svg class="t-sociallinks__svg" role="presentation" width="20px" height="20px" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M50 100c27.6142 0 50-22.3858 50-50S77.6142 0 50 0 0 22.3858 0 50s22.3858 50 50 50ZM35.3336 27.8846c1.2589-.3077 2.3116-.4739 4.8709-.7693.7839-.0905 1.3869-.103 5.2489-.1088L49.8167 27l-.0339.3452c-.0186.1899-.1204 1.6999-.2263 3.3555-.4348 6.8018-.6381 8.3757-1.3516 10.467-.2973.8712-1.0137 2.2987-1.4822 2.9532-.4581.64-1.3831 1.6092-1.9816 2.0761-1.6917 1.3198-3.8089 2.1132-7.0551 2.6436-2.6678.436-4.7613.6235-8.9945.8058-.7307.0315-1.4102.0677-1.5099.0806L27 49.7504l.0166-4.2914.0164-4.2913.2644-2.1817c.3766-3.1087.5331-3.9621.9614-5.2442.5988-1.7921 1.6612-3.2524 3.0514-4.194.9943-.6735 2.4704-1.2837 4.0234-1.6632Zm15.224 4.6389c-.0765-1.1086-.3068-5.1806-.3068-5.4268-.0001-.0912.2362-.0967 4.1877-.0967 3.9405 0 4.2223.0065 4.774.1095.3225.0601 1.072.1598 1.6656.2213 2.4298.2519 3.4802.4076 4.4588.6609 2.7604.7144 4.7564 2.2289 5.8632 4.4489.5777 1.1587.8034 1.961 1.1033 3.9217.2277 1.4894.4354 3.2249.5619 4.695.1036 1.2043.1734 6.194.1076 7.6843l-.0404.912-.4782-.0323c-1.9452-.1314-3.1578-.2092-4.768-.3061-5.2572-.3164-7.4005-.6222-9.2684-1.3223-1.6732-.6272-3.251-1.6887-4.2962-2.8902-.8884-1.0214-1.675-2.3791-2.1437-3.7002-.6773-1.909-1.1383-4.7907-1.4204-8.879ZM27.0033 58.3121v-8.1135l.1799.0002c.0989.0001.5659.0364 1.0378.0806 1.1314.1061 1.975.1679 4.5665.3346 4.1299.2655 6.0308.4888 7.5539.8872 3.8588 1.0095 6.5704 3.5441 7.8248 7.3141.5523 1.6597.9022 3.805 1.2657 7.7605.1121 1.2196.126 1.673.1193 3.8833-.0042 1.3763-.0221 2.5167-.0397 2.5343-.0541.054-7.5172-.2361-10.248-.3983-1.667-.099-2.6352-.2506-4.3727-.685-1.3707-.3426-2.1775-.633-2.8783-1.0361-1.7943-1.0319-3.0155-2.6066-3.7588-4.8469-.3924-1.1825-.6039-2.3774-1.0009-5.6545l-.2495-2.0605Zm43.838-7.92c.685-.0459 1.37-.0913 1.5222-.1009.1522-.0095.3576-.0219.4566-.0274L73 50.2539l-.0008 3.3279c-.0009 4.085-.0714 5.7459-.3382 7.9676-.2117 1.7635-.6244 3.7599-.9962 4.8196-.8917 2.5413-2.6656 4.3097-5.2174 5.2015-1.2738.4451-3.4947.8733-5.597 1.0789-1.7994.176-2.5751.2042-6.4345.2339l-3.9438.0303v-2.0673c0-1.8113.0207-2.3196.1667-4.1037.2446-2.9873.4094-4.3643.6974-5.8284.8877-4.5117 3.1252-7.4157 6.8788-8.9277 1.8378-.7403 4.0014-1.0565 9.582-1.4003.9894-.0609 2.3593-.1483 3.0443-.1941Z" fill="#f5f5f5"></path> </svg>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <i class="fab fa-youtube"></i>
                    </a>
                </div>

                <!-- Колонка 4: CTA (кнопка "Начать проект") -->
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

        <!-- Строка 2: Описание -->
        <div class="footer__row footer__row--middle">
            <p class="footer__description">
                <?php echo get_theme_mod('footer_description', 'Ваш внешний технический отдел. Поддержка и развитие digital-продуктов'); ?>
            </p>
        </div>

        <!-- Строка 3: Копирайт -->
        <div class="footer__row footer__row--bottom">
            <div class="footer__copyright">
                <small>
                    <?php
                    $current_year = date('Y');
                    echo get_theme_mod('footer_copyright', "© {$current_year}. KARTEMAKE. Все права защищены.");
                    ?>
                </small>
            </div>
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
