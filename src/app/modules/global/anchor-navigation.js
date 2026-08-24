/*
==========================================================
K·ART·MAKE V5.2
ANCHOR NAVIGATION
==========================================================

Назначение:

- Перехватывает ссылки вида:
      <a href="#modernization">

- Показывает TransitionLoader
- Выполняет безопасную навигацию
- Сохраняет корректное состояние GSAP / ScrollTrigger
- Работает с Lenis
- Работает с native scroll fallback

FLOW:

Anchor click
    ↓
TransitionLoader.cover()
    ↓
Resolve target element
    ↓
Calculate absolute DOM position
    ↓
Lenis / native scroll
    ↓
ScrollTrigger.refresh()
    ↓
wait frames
    ↓
TransitionLoader.reveal()

ВАЖНО:

AnchorNavigation НЕ управляет SceneManager.

Он отвечает только за переход к DOM-якорю.

==========================================================
*/
export default class AnchorNavigation {
  constructor() {
    console.log("[AnchorNavigation] ready")
    this.isNavigating = false;

    const headerHeight = document.getElementById('header').offsetHeight

    this.config = {
      duration: 1.8,
      offset: headerHeight * (window.innerWidth < 768 ? 3 : 7), // чтобы сцена активировалась раньше, чем якорь достигнет верха окна
      refreshFrames: 3
    };

    this.links = Array.from(document.querySelectorAll('a[href^="#"]'));
    this.init();
  }

  /*
  ========================================================
  INIT
  ========================================================
  */
  init() {
    this.links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") {
          return;
        }
        /*
        ----------------------------------------------------
        Не вмешиваемся в модифицированные клики
        ----------------------------------------------------
        */
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
          return;
        }
        /*
        ----------------------------------------------------
        Получаем ID
        ----------------------------------------------------
        */
        const id = href.slice(1);
        if (!id) {
          return;
        }
        /*
        ----------------------------------------------------
        Ищем target
        ----------------------------------------------------
        */
        const target = document.getElementById(id);
        if (!target) {
          return;
        }
        /*
        ----------------------------------------------------
        Перехватываем стандартный anchor
        ----------------------------------------------------
        */
        event.preventDefault();
        this.goTo(target);
      });
    })
  }

  /*
  ========================================================
  GO TO
  ========================================================
  */
  async goTo(target) {
    if (!target) {
      return;
    }
    /*
    --------------------------------------------------------
    Не допускаем два перехода одновременно
    --------------------------------------------------------
    */
    if (this.isNavigating) {
      console.log("[AnchorNavigation] navigation already active");
      return;
    }
    const transition = window?.App.TransitionLoader;
    if (!transition) {
      console.warn("[AnchorNavigation] TransitionLoader not found");
      return;
    }
    this.isNavigating = true;
    document.documentElement.classList.add("scene-navigation-active");
    document.body.classList.add("scene-navigation-active");
    try {
      /*
      ======================================================
      1. COVER
      ======================================================
      */
      if (target.id) {
        await transition.cover();
      }
      /*
      ======================================================
      2. CALCULATE TARGET
      ======================================================

      НЕ используем:

          target.offsetTop

      НЕ используем:

          window.scrollBy()

      Используем реальную абсолютную
      позицию элемента относительно документа.

      ======================================================
      */
      const rect = target.getBoundingClientRect();
      const targetScroll = window.scrollY + rect.top - this.config.offset;
      const targetPosition = Math.max(0, Math.round(targetScroll));
      console.log(`[AnchorNavigation] ${target.id} → ${targetPosition}px`);
      /*
      ======================================================
      3. SCROLL
      ======================================================
      */
      await window.App.OrbitNavigation.scrollTo(targetPosition);
      /*
      ======================================================
      4. WAIT
      ======================================================

      ScrollTrigger должен получить возможность
      обработать изменение scroll position.

      ======================================================
      */
      await this.nextFrames(this.config.refreshFrames);
      /*
      ======================================================
      5. GSAP REFRESH
      ======================================================
      */
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
      /*
      ------------------------------------------------------
      Дополнительные кадры после refresh
      ------------------------------------------------------
      */
      await this.nextFrames(2);
      /*
      ======================================================
      6. REVEAL
      ======================================================
      */
      await transition.reveal();
      /*
      ======================================================
      7. UPDATE HASH
      ======================================================
      */
      if (target.id) {
        history.pushState(null, "", `#${target.id}`);
      }
    } catch (error) {
      console.error("[AnchorNavigation] navigation failed", error);
      /*
      ------------------------------------------------------
      В случае ошибки обязательно
      освобождаем TransitionLoader.
      ------------------------------------------------------
      */
      transition.finish();
    } finally {
      this.isNavigating = false;
      document.documentElement.classList.remove("scene-navigation-active");
      document.body.classList.remove("scene-navigation-active");
    }
  }

  /*
  ========================================================
  SCROLL TO
  ========================================================
  */
  scrollTo(target) {
    return new Promise(resolve => {
      /*
      ======================================================
      LENIS
      ======================================================
      */
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(target, {
          duration: this.config.duration,
          easing: t => 1 - Math.pow(1 - t, 4),
          immediate: false,
          force: true,
          onComplete: () => {
            /*
            ------------------------------------------------
            Lenis иногда завершает callback
            чуть раньше фактического DOM scroll.
            ------------------------------------------------
            */
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                resolve();
              });
            });
          }
        });
        return;
      }
      /*
      ======================================================
      NATIVE SCROLL FALLBACK
      ======================================================
      */
      const start = window.scrollY;
      const distance = target - start;
      const duration = this.config.duration * 1000;
      const started = performance.now();
      const animate = now => {
        const elapsed = now - started;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        window.scrollTo(0, start + distance * eased);
        if (progress >= 1) {
          resolve();
          return;
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  }

  /*
  ========================================================
  NEXT FRAMES
  ========================================================
  */
  nextFrames(count = 2) {
    return new Promise(resolve => {
      let frames = 0;
      const tick = () => {
        frames++;
        if (frames >= count) {
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /*
  ========================================================
  DESTROY
  ========================================================
  */
  destroy() {
    /*
    Здесь пока ничего не удаляем,
    поскольку обработчик установлен
    через document.addEventListener.

    Если понадобится hot reload —
    вынесем handler в this.boundHandler.
    */
    this.isNavigating = false;
  }
}
