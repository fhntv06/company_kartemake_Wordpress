<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>
        <?php
        if (is_front_page() || is_home()) {
            echo get_theme_mod('homepage_title', 'KARTEMAKE - Создание и поддержка сайтов');
        } else {
            wp_title('|', true, 'right');
            bloginfo('name');
        }
        ?>
    </title>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>
    id="smoothScrollContainer"
    data-controller="<?php echo kartemake_get_body_controllers(); ?>">
<?php wp_body_open(); ?>

<header class="header" data-controller="header">
    <a href="<?php echo home_url('/'); ?>" class="logo">
        <span class="font-size-h3">K</span>
        <span class="font-size-h3">·</span>
        <span class="font-size-h4 color-accent-red">ART</span>
        <span class="font-size-h3">·</span>
        <span class="font-size-h5">MAKE</span>
    </a>

    <nav class="nav-links">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'header-menu',
            'container'      => false,
            'menu_class'     => '',
            'fallback_cb'    => false,
            'depth'          => 1,
            'echo'           => true,
            'items_wrap'     => '%3$s',
        ));
        ?>
    </nav>

    <div class="header-controls">
        <div class="social-links">
            <a href="https://github.com/fhntv06" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i>
            </a>
            <a href="https://t.me/KArtech76" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-telegram"></i>
            </a>
            <a href="https://vk.com/k.artem76" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-vk"></i>
            </a>
        </div>

        <div class="phone">
            <i class="fas fa-phone"></i>
            <span><?php echo get_theme_mod('header_phone', '+7 (908) 946-14-83'); ?></span>
        </div>

        <button class="theme-toggle" data-controller-theme="item">
            <i class="fas fa-moon"></i>
        </button>

        <button
            class="cta-button"
            data-controller-modal-open="form"
            data-controller-modal-func="open"
            data-controller-ripple-effect="item"
        >
            Начать проект
            <i class="fas fa-arrow-right"></i>
        </button>

        <button class="burger-menu" id="burgerMenu" data-controller-burger-menu="item">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>

<main id="main-content">