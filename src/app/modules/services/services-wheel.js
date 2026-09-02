/**
 * K·ART·MAKE
 * Services Wheel
 *
 * Interactive orbital navigation for the Services page.
 *
 * DOM contract:
 *
 * .services-wheel
 * ├── .services-wheel__stage
 * │   ├── .services-wheel-item[data-service]
 * │   │   └── [data-service-select]
 * │   └── .services-wheel__core
 * │
 * ├── .services-wheel__details
 * │   └── .services-wheel-detail[data-service-detail]
 * │
 * └── .services-wheel__navigation
 *     └── .services-wheel-nav[data-service-nav]
 */
export default class ServicesWheel {
    constructor() {
        this.scene = document.querySelector('.services-wheel');

        if (!this.scene) {
            console.warn("[ServicesWheel] Scene not found");
            return;
        }

        this.stage = null;
        this.items = [];
        this.details = [];
        this.navigation = [];
        this.activeIndex = 0;
        this.isInitialized = false;
        this.isAnimating = false;
        this.isDestroyed = false;
        this.rotation = 0;
        this.targetRotation = 0;
        this.autoRotate = true;
        this.autoRotateDelay = 5000;
        this.autoRotateTimer = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.isDragging = false;
        this.resizeObserver = null;
        this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = this.mediaQuery.matches;
        this.handleSelect = this.handleSelect.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.handlePointerCancel = this.handlePointerCancel.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleReducedMotionChange = this.handleReducedMotionChange.bind(this);

        this.init()
    }
    /* =========================================================
       INIT
    ========================================================= */
    init() {
        if (this.isInitialized || this.isDestroyed) {
            return;
        }
        this.collectElements();
        if (!this.stage || this.items.length === 0) {
            return;
        }
        this.bindEvents();
        this.setupResizeObserver();
        this.reducedMotion = this.mediaQuery.matches;
        this.setInitialState();
        this.isInitialized = true;
        this.scheduleAutoRotate();
    }
    /* =========================================================
       ELEMENTS
    ========================================================= */
    collectElements() {
        this.stage = this.scene.querySelector('.services-wheel__stage');
        this.items = Array.from(this.scene.querySelectorAll('.services-wheel-item[data-service]'));
        if (!this.items.length) {
            console.warn("[ServicesWheel] Items not found");
            return;
        }

        this.details = Array.from(this.scene.querySelectorAll('.services-wheel-detail[data-service-detail]'));
        if (!this.details.length) {
            console.warn("[ServicesWheel] Details not found");
            return;
        }

        this.navigation = Array.from(this.scene.querySelectorAll('.services-wheel-nav[data-service-nav]'));
        if (!this.navigation) {
            console.warn("[ServicesWheel] Navigation not found");
        }
    }
    /* =========================================================
       EVENTS
    ========================================================= */
    bindEvents() {
        this.scene.addEventListener('click', this.handleSelect);
        document.addEventListener('keydown', this.handleKeyDown);
        this.stage.addEventListener('pointerdown', this.handlePointerDown);
        this.stage.addEventListener('pointermove', this.handlePointerMove);
        this.stage.addEventListener('pointerup', this.handlePointerUp);
        this.stage.addEventListener('pointercancel', this.handlePointerCancel);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        this.mediaQuery.addEventListener('change', this.handleReducedMotionChange);
    }
    /* =========================================================
       INITIAL STATE
    ========================================================= */
    setInitialState() {
        const activeItemIndex = this.items.findIndex(item => item.classList.contains('is-active'));
        if (activeItemIndex >= 0) {
            this.activeIndex = activeItemIndex;
        } else {
            this.activeIndex = 0;
        }
        this.rotation = 0;
        this.targetRotation = 0;
        this.updateDetails();
        this.updateNavigation();
        this.render(true);
    }
    /* =========================================================
       SELECT
    ========================================================= */
    handleSelect(event) {
        const serviceTrigger = event.target.closest('[data-service-select]');
        if (serviceTrigger && this.scene.contains(serviceTrigger)) {
            const service = serviceTrigger.dataset.serviceSelect;
            this.selectService(service);
            return;
        }
        const navigationTrigger = event.target.closest('[data-service-nav]');
        if (navigationTrigger && this.scene.contains(navigationTrigger)) {
            const service = navigationTrigger.dataset.serviceNav;
            this.selectService(service);
            return;
        }
    }
    selectService(service) {
        if (!service || this.isDestroyed) {
            return;
        }
        const nextIndex = this.items.findIndex(item => item.dataset.service === service);
        if (nextIndex < 0) {
            return;
        }
        if (nextIndex === this.activeIndex) {
            this.restartAutoRotate();
            return;
        }
        this.activeIndex = nextIndex;
        this.updateDetails();
        this.updateNavigation();
        this.rotateToActive();
        this.restartAutoRotate();
    }
    /* =========================================================
       KEYBOARD
    ========================================================= */
    handleKeyDown(event) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.matches('input') || activeElement.matches('textarea') || activeElement.matches('select'))) {
            return;
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectIndex(this.activeIndex + 1);
            return;
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectIndex(this.activeIndex - 1);
            return;
        }
        if (event.key === 'Home') {
            event.preventDefault();
            this.selectIndex(0);
            return;
        }
        if (event.key === 'End') {
            event.preventDefault();
            this.selectIndex(this.items.length - 1);
        }
    }
    selectIndex(index) {
        const length = this.items.length;
        if (!length) {
            return;
        }
        const normalizedIndex = ((index % length) + length) % length;
        const item = this.items[normalizedIndex];
        if (!item) {
            return;
        }
        this.selectService(item.dataset.service);
    }
    /* =========================================================
       ROTATION
    ========================================================= */
    rotateToActive() {
        const count = this.items.length;
        if (count <= 1) {
            return;
        }
        const step = 360 / count;
        /*
         * Every service has a logical position:
         *
         * 0 = active
         * 1 = next
         * 2 = opposite
         * 3 = previous
         *
         * The complete orbit rotates by one step whenever
         * activeIndex changes.
         */
        const desiredRotation = -(this.activeIndex * step);
        this.targetRotation = desiredRotation;
        /*
         * Keep rotation close to current rotation.
         * This prevents GSAP from taking the long way around.
         */
        this.targetRotation = this.normalizeRotation(this.targetRotation, this.rotation);
        this.animateRotation();
    }
    normalizeRotation(target, current) {
        let normalizedTarget = target;
        while (normalizedTarget - current > 180) {
            normalizedTarget -= 360;
        }
        while (normalizedTarget - current < -180) {
            normalizedTarget += 360;
        }
        return normalizedTarget;
    }
    animateRotation() {
        if (this.reducedMotion) {
            this.rotation = this.targetRotation;
            this.render(true);
            return;
        }
        if (typeof gsap === 'undefined') {
            this.rotation = this.targetRotation;
            this.render(true);
            return;
        }
        this.isAnimating = true;
        gsap.killTweensOf(this);
        gsap.to(this, {
            rotation: this.targetRotation,
            duration: 0.9,
            ease: 'power3.inOut',
            overwrite: true,
            onUpdate: () => {
                this.render();
            },
            onComplete: () => {
                this.rotation = this.targetRotation;
                this.isAnimating = false;
                this.render(true);
            }
        });
    }
    /* =========================================================
       RENDER
    ========================================================= */
    render(force = false) {
        if (!this.stage) {
            return;
        }
        const count = this.items.length;
        if (!count) {
            return;
        }
        const stageWidth = this.stage.clientWidth;
        const stageHeight = this.stage.clientHeight;
        if (stageWidth <= 0 || stageHeight <= 0) {
            return;
        }
        /*
         * Orbit follows the visible circular frame:
         *
         * .services-wheel__orbit {
         *     inset: 9%;
         * }
         *
         * We use the center of that orbit.
         */
        const radiusX = stageWidth * 0.41;
        const radiusY = stageHeight * 0.41;
        const step = 360 / count;
        this.items.forEach((item, index) => {
            const logicalIndex = this.getLogicalIndex(index, this.activeIndex, count);
            const angle = (-90) + (logicalIndex * step) + this.rotation;
            const radians = angle * (Math.PI / 180);
            const x = Math.cos(radians) * radiusX;
            const y = Math.sin(radians) * radiusY;
            const isActive = index === this.activeIndex;
            const depth = (Math.sin(radians) + 1) / 2;
            const scale = isActive ? 1 : 0.78 + (depth * 0.12);
            const opacity = isActive ? 1 : 0.45 + (depth * 0.35);
            const zIndex = isActive ? 10 : Math.round(depth * 5);
            const transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
            if (force || item.dataset.renderTransform !== transform) {
                item.style.transform = transform;
                item.dataset.renderTransform = transform;
            }
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }
    getLogicalIndex(index, activeIndex, count) {
        let position = index - activeIndex;
        if (position < 0) {
            position += count;
        }
        return position;
    }
    /* =========================================================
       DETAILS
    ========================================================= */
    updateDetails() {
        const activeItem = this.items[this.activeIndex];
        if (!activeItem) {
            return;
        }
        const activeService = activeItem.dataset.service;
        this.details.forEach(detail => {
            const isActive = detail.dataset.serviceDetail === activeService;
            detail.classList.toggle('is-active', isActive);
            detail.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
        const activeIndexElement = this.scene.querySelector('[data-service-active-index]');
        if (activeIndexElement) {
            const index = String(this.activeIndex + 1).padStart(2, '0');
            const total = String(this.items.length).padStart(2, '0');
            activeIndexElement.textContent = `${index} / ${total}`;
        }
    }
    /* =========================================================
       NAVIGATION
    ========================================================= */
    updateNavigation() {
        const activeItem = this.items[this.activeIndex];
        if (!activeItem) {
            return;
        }
        const activeService = activeItem.dataset.service;
        this.navigation.forEach(button => {
            const isActive = button.dataset.serviceNav === activeService;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }
    /* =========================================================
       POINTER / SWIPE
    ========================================================= */
    handlePointerDown(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.isDragging = true;
        this.pauseAutoRotate();
        if (this.stage.setPointerCapture) {
            try {
                this.stage.setPointerCapture(event.pointerId);
            } catch (error) {
                // Pointer capture may fail on some browsers.
            }
        }
    }
    handlePointerMove(event) {
        if (!this.isDragging) {
            return;
        }
        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;
        /*
         * Only treat horizontal movement as wheel navigation.
         * This prevents vertical page scrolling from being blocked.
         */
        if (Math.abs(deltaX) < 8 || Math.abs(deltaX) < Math.abs(deltaY)) {
            return;
        }
        event.preventDefault();
    }
    handlePointerUp(event) {
        if (!this.isDragging) {
            return;
        }
        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;
        this.isDragging = false;
        if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) {
            this.restartAutoRotate();
            return;
        }
        if (deltaX < 0) {
            this.selectIndex(this.activeIndex + 1);
        } else {
            this.selectIndex(this.activeIndex - 1);
        }
    }
    handlePointerCancel() {
        this.isDragging = false;
        this.restartAutoRotate();
    }
    /* =========================================================
       AUTO ROTATION
    ========================================================= */
    scheduleAutoRotate() {
        this.clearAutoRotate();
        if (!this.autoRotate || this.reducedMotion || this.isDestroyed) {
            return;
        }
        if (document.visibilityState !== 'visible') {
            return;
        }
        this.autoRotateTimer = window.setTimeout(() => {
            if (this.isDestroyed || this.isDragging) {
                return;
            }
            this.selectIndex(this.activeIndex + 1);
        }, this.autoRotateDelay);
    }
    restartAutoRotate() {
        this.scheduleAutoRotate();
    }
    pauseAutoRotate() {
        this.clearAutoRotate();
    }
    clearAutoRotate() {
        if (this.autoRotateTimer !== null) {
            window.clearTimeout(this.autoRotateTimer);
            this.autoRotateTimer = null;
        }
    }
    /* =========================================================
       VISIBILITY
    ========================================================= */
    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this.pauseAutoRotate();
            return;
        }
        this.scheduleAutoRotate();
    }
    /* =========================================================
       REDUCED MOTION
    ========================================================= */
    handleReducedMotionChange(event) {
        this.reducedMotion = event.matches;
        if (this.reducedMotion) {
            this.clearAutoRotate();
            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(this);
            }
            this.isAnimating = false;
            this.rotation = this.targetRotation;
            this.render(true);
            return;
        }
        this.scheduleAutoRotate();
    }
    /* =========================================================
       RESIZE
    ========================================================= */
    setupResizeObserver() {
        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', this.handleResize);
            return;
        }
        this.resizeObserver = new ResizeObserver(() => {
            this.render(true);
        });
        this.resizeObserver.observe(this.stage);
    }
    /* =========================================================
       DESTROY
    ========================================================= */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        this.isDestroyed = true;
        this.clearAutoRotate();
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(this);
        }
        this.scene.removeEventListener('click', this.handleSelect);
        document.removeEventListener('keydown', this.handleKeyDown);
        if (this.stage) {
            this.stage.removeEventListener('pointerdown', this.handlePointerDown);
            this.stage.removeEventListener('pointermove', this.handlePointerMove);
            this.stage.removeEventListener('pointerup', this.handlePointerUp);
            this.stage.removeEventListener('pointercancel', this.handlePointerCancel);
        }
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        if (this.mediaQuery.removeEventListener) {
            this.mediaQuery.removeEventListener('change', this.handleReducedMotionChange);
        } else {
            this.mediaQuery.removeListener(this.handleReducedMotionChange);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        this.isInitialized = false;
    }
}
