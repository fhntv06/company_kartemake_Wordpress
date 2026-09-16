/**
 * K·ART·MAKE
 * Cost Calculator
 *
 * Modes:
 * - scene  : calculator lives inside a scene
 * - widget : floating trigger + modal calculator
 *
 * HTML:
 * <div class="cost-calculator" data-cost-calculator data-mode="scene">
 *
 * or
 *
 * <div class="cost-calculator"
 *      data-cost-calculator
 *      data-mode="widget">
 */
export default class CostCalculator {
    constructor() {
        this.container = document.querySelector("[data-cost-calculator]");
        if (!this.container) {
            console.warn("[CostCalculator] Container not found");
            return;
        }
        this.options = {
            mode: this.container.dataset.mode || "scene",
            currency: "₽",
            animationDuration: 650,
            pulseDuration: 500,
            particleCount: 3,
            maxVisualPrice: 155000,
            // Resize debounce
            resizeDelay: 120,
        };
        this.state = {
            selected: new Map(),
            total: 0,
        };
        this.displayedPrice = 0;
        this.priceAnimationFrame = null;
        this.resizeTimer = null;
        /**
         * Map:
         *
         * serviceId -> {
         *     path,
         *     particles: [],
         *     length
         * }
         */
        this.flowAnimations = new Map();
        this.initialized = false;
        this.init();
    }
    /* =========================================================
       INIT
    ========================================================= */
    init() {
        if (this.initialized) return;
        this.initialized = true;
        this.cacheElements();
        this.bindEvents();
        this.update();
        window.addEventListener("resize", this.handleResize, {
            passive: true,
        });
        this.container.dispatchEvent(
            new CustomEvent("costCalculatorReady", {
                detail: {
                    calculator: this,
                },
            })
        );
    }
    /* =========================================================
       CACHE
    ========================================================= */
    cacheElements() {
        this.stage = this.container.querySelector(
            "[data-calculator-stage]"
        );
        this.center = this.container.querySelector(
            "[data-calculator-center]"
        );
        this.price = this.container.querySelector(
            "[data-calculator-price]"
        );
        this.meta = this.container.querySelector(
            "[data-calculator-meta]"
        );
        this.flowLayer = this.container.querySelector(
            "[data-calculator-flows]"
        );
        this.nodes = [
            ...this.container.querySelectorAll(
                "[data-cost-service]"
            ),
        ];
        this.actions = this.container.querySelector(
            "[data-calculator-actions]"
        );
        this.nextButton = this.container.querySelector(
            "[data-calculator-next]"
        );
        this.backButton = this.container.querySelector(
            "[data-calculator-back]"
        );
        this.result = this.container.querySelector(
            "[data-calculator-result]"
        );
        this.resultPrice = this.container.querySelector(
            "[data-calculator-result-price]"
        );
        this.resultServices = this.container.querySelector(
            "[data-calculator-result-services]"
        );
        this.closeButton = this.container.querySelector(
            "[data-calculator-close]"
        );
        this.trigger = this.container.querySelector(
            "[data-calculator-trigger]"
        );
    }
    /* =========================================================
       EVENTS
    ========================================================= */
    bindEvents() {
        this.nodes.forEach((node) => {
            node.addEventListener("click", () => {
                this.toggleService(node);
            });
        });
        if (this.nextButton) {
            this.nextButton.addEventListener("click", () => {
                this.showResult();
            });
        }
        if (this.backButton) {
            this.backButton.addEventListener("click", () => {
                this.hiddenResult();
            });
        }
        if (this.closeButton) {
            this.closeButton.addEventListener("click", () => {
                this.closeWidget();
            });
        }
        if (this.trigger) {
            this.trigger.addEventListener("click", () => {
                this.openWidget();
            });
        }
        this.container.addEventListener("click", (event) => {
            if (
                event.target.matches(
                    "[data-calculator-backdrop]"
                )
            ) {
                this.closeWidget();
            }
        });
    }
    /* =========================================================
       RESIZE
    ========================================================= */
    handleResize = () => {
        /**
         * IMPORTANT:
         *
         * Не перестраиваем flows на каждый resize event.
         *
         * Браузер может отправлять десятки/сотни resize-событий
         * во время изменения размера окна.
         */
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(() => {
            this.updateFlowPaths();
            this.resizeTimer = null;
        }, this.options.resizeDelay);
    };
    /* =========================================================
       SERVICES
    ========================================================= */
    toggleService(node) {
        const id = node.dataset.costService;
        const price = Number(node.dataset.price || 0);
        if (!id) return;
        if (this.state.selected.has(id)) {
            this.removeService(node);
        } else {
            this.addService(node, price);
        }
        this.update();
    }
    addService(node, price) {
        const id = node.dataset.costService;
        this.state.selected.set(id, {
            id,
            price,
            title:
                node.dataset.title ||
                node
                    .querySelector("[data-service-title]")
                    ?.textContent
                    ?.trim() ||
                id,
        });
        node.classList.add(
            "cost-service--selected"
        );
        this.createFlow(node);
    }
    removeService(node) {
        const id = node.dataset.costService;
        this.state.selected.delete(id);
        node.classList.remove(
            "cost-service--selected"
        );
        this.removeFlow(id);
    }
    /* =========================================================
       CALCULATION
    ========================================================= */
    calculate() {
        let total = 0;
        this.state.selected.forEach((service) => {
            total += service.price;
        });
        return total;
    }
    update() {
        const total = this.calculate();
        this.state.total = total;
        this.animatePrice(total);
        this.updateMeta();
        this.updateGlow(total);
        this.pulseCenter();
        this.toggleDisabledButtonActions();
        this.container.dispatchEvent(
            new CustomEvent("costCalculatorChange", {
                detail: {
                    total,
                    services: this.getSelectedServices(),
                },
            })
        );
    }
    toggleDisabledButtonActions() {
        if (!this.nextButton) return;
        this.nextButton.disabled =
            !Boolean(this.state.selected.size);
    }
    getSelectedServices() {
        return [
            ...this.state.selected.values(),
        ];
    }
    /* =========================================================
       PRICE
    ========================================================= */
    animatePrice(target) {
        if (!this.price) return;
        if (this.priceAnimationFrame) {
            cancelAnimationFrame(
                this.priceAnimationFrame
            );
        }
        const startValue = this.displayedPrice;
        const startTime = performance.now();
        const duration =
            this.options.animationDuration;
        const tick = (now) => {
            const progress = Math.min(
                (now - startTime) / duration,
                1
            );
            const eased =
                1 - Math.pow(1 - progress, 3);
            this.displayedPrice = Math.round(
                startValue +
                (target - startValue) *
                eased
            );
            this.price.textContent =
                this.formatPrice(
                    this.displayedPrice
                );
            if (progress < 1) {
                this.priceAnimationFrame =
                    requestAnimationFrame(tick);
            } else {
                this.priceAnimationFrame = null;
            }
        };
        this.priceAnimationFrame =
            requestAnimationFrame(tick);
    }
    formatPrice(value) {
        return new Intl.NumberFormat(
            "ru-RU"
        ).format(value);
    }
    updateMeta() {
        if (!this.meta) return;
        const count =
            this.state.selected.size;
        let label = "услуг";
        if (count === 1) {
            label = "услуга";
        } else if (
            count > 1 &&
            count < 5
        ) {
            label = "услуги";
        }
        this.meta.textContent = count + ' ' + label + ' ' + 'выбрано';
    }
    updateGlow(total) {
        if (!this.center) return;
        const intensity = Math.min(
            total /
            this.options.maxVisualPrice,
            1
        );
        this.center.style.setProperty(
            "--price-intensity",
            intensity.toFixed(3)
        );
    }
    pulseCenter() {
        if (!this.center) return;
        this.center.classList.remove(
            "cost-calculator__center--pulse"
        );
        void this.center.offsetWidth;
        this.center.classList.add(
            "cost-calculator__center--pulse"
        );
    }
    /* =========================================================
       FLOW SYSTEM
    ========================================================= */
    createFlow(node) {
        if (!this.flowLayer || !this.stage) {
            return;
        }
        const id =
            node.dataset.costService;
        if (!id) return;
        /**
         * Если flow уже существует,
         * просто обновляем его позицию.
         */
        if (this.flowAnimations.has(id)) {
            this.updateFlowPath(id, node);
            return;
        }
        const path =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );
        path.classList.add(
            "cost-calculator__flow"
        );
        path.dataset.flow = id;
        const pathData =
            this.getFlowPath(node);
        path.setAttribute(
            "d",
            pathData
        );
        this.flowLayer.appendChild(path);
        /**
         * getTotalLength вызываем ОДИН раз
         * при создании flow.
         */
        let length = 0;
        try {
            length = path.getTotalLength();
        } catch (error) {
            console.warn(
                "[CostCalculator] Unable to calculate flow length",
                error
            );
        }
        const flow = {
            path,
            particles: [],
            length,
        };
        this.flowAnimations.set(
            id,
            flow
        );
        /**
         * Частицы создаём после того,
         * как flow уже записан в Map.
         */
        for (
            let i = 0;
            i < this.options.particleCount;
            i++
        ) {
            const particle =
                this.createParticle(
                    flow,
                    i
                );
            if (particle) {
                flow.particles.push(
                    particle
                );
            }
        }
    }
    createParticle(flow, index) {
        if (!this.flowLayer) {
            return null;
        }
        const particle =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );
        particle.classList.add(
            "cost-calculator__particle"
        );
        particle.setAttribute(
            "r",
            "2.2"
        );
        this.flowLayer.appendChild(
            particle
        );
        const duration =
            1200 +
            Math.random() * 600;
        const offset =
            index /
            this.options.particleCount;
        const started =
            performance.now();
        /**
         * Длина path НЕ вычисляется
         * каждый animation frame.
         *
         * Берём её из flow.length.
         */
        const animate = (time) => {
            if (
                !particle.isConnected ||
                !flow.path.isConnected
            ) {
                return;
            }
            const elapsed =
                time - started;
            const progress =
                ((elapsed / duration) +
                    offset) %
                1;
            if (flow.length > 0) {
                const point =
                    flow.path.getPointAtLength(
                        flow.length *
                        progress
                    );
                particle.setAttribute(
                    "cx",
                    point.x
                );
                particle.setAttribute(
                    "cy",
                    point.y
                );
            }
            particle._raf =
                requestAnimationFrame(
                    animate
                );
        };
        particle._raf =
            requestAnimationFrame(
                animate
            );
        return particle;
    }
    /* =========================================================
       FLOW PATH UPDATE
    ========================================================= */
    updateFlowPaths() {
        if (
            !this.flowAnimations.size
        ) {
            return;
        }
        /**
         * ВАЖНО:
         *
         * Мы НЕ удаляем flows.
         * Мы НЕ создаём particles заново.
         * Мы НЕ трогаем RAF.
         *
         * Только пересчитываем d.
         */
        this.flowAnimations.forEach(
            (flow, id) => {
                const node =
                    this.nodes.find(
                        (item) =>
                            item.dataset
                                .costService ===
                            id
                    );
                if (!node) return;
                this.updateFlowPath(
                    id,
                    node
                );
            }
        );
    }
    updateFlowPath(id, node) {
        const flow =
            this.flowAnimations.get(id);
        if (!flow || !flow.path) {
            return;
        }
        const pathData =
            this.getFlowPath(node);
        flow.path.setAttribute(
            "d",
            pathData
        );
        /**
         * После resize геометрия path
         * изменилась, поэтому длину нужно
         * пересчитать ОДИН раз.
         */
        try {
            flow.length =
                flow.path.getTotalLength();
        } catch (error) {
            flow.length = 0;
            console.warn(
                "[CostCalculator] Unable to recalculate flow length",
                error
            );
        }
    }
    getFlowPath(node) {
        if (
            !this.stage ||
            !this.center
        ) {
            return "";
        }
        const start =
            this.getNodePoint(node);
        const center =
            this.getCenterPoint();
        const dx =
            center.x - start.x;
        const dy =
            center.y - start.y;
        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );
        /**
         * Защита от деления на ноль.
         */
        if (distance < 0.001) {
            return `
M ${start.x} ${start.y}
L ${center.x} ${center.y}
`;
        }
        const normalX =
            -dy / distance;
        const normalY =
            dx / distance;
        const bend = Math.min(
            65,
            distance * 0.14
        );
        const middleX =
            (start.x + center.x) /
            2 +
            normalX * bend;
        const middleY =
            (start.y + center.y) /
            2 +
            normalY * bend;
        return `
            M ${start.x} ${start.y}
            Q ${middleX} ${middleY}
            ${center.x} ${center.y}
            `;
    }
    getNodePoint(node) {
        const stageRect =
            this.stage.getBoundingClientRect();
        const nodeRect =
            node.getBoundingClientRect();
        return {
            x:
                nodeRect.left -
                stageRect.left +
                nodeRect.width / 2,
            y:
                nodeRect.top -
                stageRect.top +
                nodeRect.height / 2,
        };
    }
    getCenterPoint() {
        const stageRect =
            this.stage.getBoundingClientRect();
        const centerRect =
            this.center.getBoundingClientRect();
        return {
            x:
                centerRect.left -
                stageRect.left +
                centerRect.width / 2,
            y:
                centerRect.top -
                stageRect.top +
                centerRect.height / 2,
        };
    }
    /* =========================================================
       REMOVE FLOW
    ========================================================= */
    removeFlow(id) {
        const flow =
            this.flowAnimations.get(id);
        if (!flow) return;
        flow.particles.forEach(
            (particle) => {
                if (particle._raf) {
                    cancelAnimationFrame(
                        particle._raf
                    );
                    particle._raf = null;
                }
                particle.remove();
            }
        );
        flow.particles.length = 0;
        if (flow.path) {
            flow.path.remove();
        }
        this.flowAnimations.delete(id);
    }
    /* =========================================================
       RESULT
    ========================================================= */
    showResult() {
        if (!this.result) return;
        if (this.resultPrice) {
            this.resultPrice.textContent =
                `${this.formatPrice(
                    this.state.total
                )} ${this.options.currency}`;
        }
        if (this.resultServices) {
            this.resultServices.innerHTML =
                this
                    .getSelectedServices()
                    .map(
                        (service) => `
<li>
<span>
${service.title}
</span>

<strong>
    ${this.formatPrice(
                            service.price
                        )} ₽
</strong>
</li>
`
                    )
                    .join("");
        }
        this.result.classList.add(
            "cost-calculator__result--visible"
        );
        this.container.classList.add(
            "cost-calculator--result"
        );
    }
    hiddenResult() {
        if (!this.result) return;
        /**
         * Исправлено:
         *
         * showResult()
         * -> --visible
         *
         * hiddenResult()
         * -> теперь удаляет тот же класс.
         */
        this.result.classList.remove(
            "cost-calculator__result--visible"
        );
        this.container.classList.remove(
            "cost-calculator--result"
        );
    }
    /* =========================================================
       WIDGET
    ========================================================= */
    openWidget() {
        this.container.classList.add(
            "cost-calculator-widget--open"
        );
        document.body.classList.add(
            "cost-calculator-modal-open"
        );
    }
    closeWidget() {
        this.container.classList.remove(
            "cost-calculator-widget--open"
        );
        document.body.classList.remove(
            "cost-calculator-modal-open"
        );
    }
    /* =========================================================
       PUBLIC API
    ========================================================= */
    getCalculation() {
        return {
            total: this.state.total,
            services:
                this.getSelectedServices(),
            currency:
            this.options.currency,
            recurring:
                this.state.selected.has(
                    "support"
                ),
        };
    }
    reset() {
        this.state.selected.clear();
        this.nodes.forEach(
            (node) => {
                node.classList.remove(
                    "cost-service--selected"
                );
            }
        );
        const flowIds = [
            ...this.flowAnimations.keys(),
        ];
        flowIds.forEach((id) => {
            this.removeFlow(id);
        });
        this.update();
    }
    /* =========================================================
       DESTROY
    ========================================================= */
    destroy() {
        if (!this.initialized) {
            return;
        }
        /**
         * Убираем resize listener.
         */
        window.removeEventListener(
            "resize",
            this.handleResize
        );
        /**
         * Убираем отложенный resize.
         */
        if (this.resizeTimer) {
            clearTimeout(
                this.resizeTimer
            );
            this.resizeTimer = null;
        }
        /**
         * Останавливаем animation price.
         */
        if (this.priceAnimationFrame) {
            cancelAnimationFrame(
                this.priceAnimationFrame
            );
            this.priceAnimationFrame = null;
        }
        /**
         * Уничтожаем все flows
         * и их RAF.
         */
        this.flowAnimations.forEach(
            (flow) => {
                flow.particles.forEach(
                    (particle) => {
                        if (particle._raf) {
                            cancelAnimationFrame(
                                particle._raf
                            );
                            particle._raf =
                                null;
                        }
                        particle.remove();
                    }
                );
                flow.particles.length = 0;
                if (flow.path) {
                    flow.path.remove();
                }
            }
        );
        this.flowAnimations.clear();
        this.initialized = false;
    }
}