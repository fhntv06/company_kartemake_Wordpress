export class ScrollRevealController {
    constructor(controllerName, container) {
        this.controllerName = controllerName;
        this.container = container;

        this.items = container.querySelectorAll(`[data-controller-${controllerName}="item"]`)

        if (!this.items.length) {
            throw new Error(`No have controller items in ${controllerName}`)
        }

        // Проверяем мобильное устройство
        this.isMobile = window.innerWidth <= 768;

        if (this.isMobile) {
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.isIntersecting
                    ? entry.target.classList.add('reveal')
                    : entry.target.classList.remove('reveal')
            });
        }, {
            threshold: 1,
            rootMargin: '-50px 0px 0px 0px'
        });

        this.items.forEach(el => {
            observer.observe(el);
        });
    }
}
