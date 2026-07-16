<aside class="sidebar-burger-menu" id="sidebar-burger-menu">
    <div class="close-modal" data-controller-burger-menu="item">
        <i class="fas fa-times"></i>
    </div>

    <nav>
        <ul class="sidebar-nav">
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
        </ul>
    </nav>

    <button
        class="cta-button"
        data-controller-modal-open="form"
        data-controller-modal-func="open"
        data-controller-ripple-effect="item"
    >
        Начать проект
        <i class="fas fa-arrow-right"></i>
    </button>

    <div class="sidebar-social">
        <button
            class="theme-toggle"
            data-controller-theme="item"
            data-controller-ripple-effect="item"
        >
            <i class="fas fa-moon"></i>
        </button>
    </div>

    <div class="sidebar-social">
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
</aside>
