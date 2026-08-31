/*
==========================================================
K·ART·MAKE V5.2
ORBIT NAVIGATION
==========================================================

Responsibilities:

- Orbit point navigation
- SceneManager integration
- TransitionLoader integration
- Lenis smooth scrolling
- Active orbit state
==========================================================
*/
export default class OrbitNavigation {
  constructor() {
    console.log("[OrbitNavigation] ready")

    this.navigation = document.getElementById('orbit-navigation')
    if (!this.navigation) {
      console.warn('[OrbitNavigation] Not found navigation element!')
      return
    }

    this.points = Array.from(this.navigation.querySelectorAll(".orbit-point"));

    if (!this.points.length) {
      console.warn('[OrbitNavigation] Not found points elements!')
      return
    }

    this.scenes = Array.from(document.querySelectorAll(".scene[data-scene]"));

    if (!this.scenes.length) {
      console.warn('[OrbitNavigation] Not found scenes elements!')
      return
    }

    this.headerOffsetHeight = window?.App?.GlobalVariables?.globalConfig.headerOffsetHeight ?? 80;
    this.activeScene = null;
    this.isNavigating = false;
    this.config = {
      duration: 1.8,
      offset: this.headerOffsetHeight * 1.5
    };
    this.init();
  }

  /*
  ==========================================================
  INIT
  ==========================================================
  */
  init() {
    /*
    ========================================================
    SCENE CHANGE
    ========================================================
    */
    window.addEventListener("sceneChange", event => {
      const scene = event.detail?.scene;
      if (!scene) {
        return;
      }
      this.activate(scene);
    });
    /*
    ========================================================
    ORBIT CLICKS
    ========================================================
    */
    this.points.forEach(point => {
      point.addEventListener("click", event => {
        event.preventDefault();
        const scene = point.dataset.scene;
        if (!scene) {
          return;
        }
        this.goToScene(scene);
      });
    });

    let isVisible = false
    const updateNavigation = () => {
      const shouldShow = window.scrollY > window.innerHeight * 0.1

      if (shouldShow === isVisible) return

      isVisible = shouldShow
      this.navigation.classList.toggle('visible', shouldShow)
    }
    window.addEventListener('scroll', updateNavigation)
  }

  /*
  ==========================================================
  ACTIVATE ORBIT POINT
  ==========================================================
  */
  activate(sceneName) {
    if (!sceneName) {
      return;
    }
    this.points.forEach(point => {
      const pointScene = point.dataset.scene;
      point.classList.toggle("active", pointScene === sceneName);
    });
    this.activeScene = sceneName;
    console.log(`[OrbitNavigation] active: ${sceneName}`);
  }
  /*
  ==========================================================
  GO TO SCENE
  ==========================================================
  */
  async goToScene(sceneName) {
    if (!sceneName) {
      return;
    }
    /*
    ========================================================
    PREVENT OVERLAPPING NAVIGATION
    ========================================================
    */
    if (this.isNavigating) {
      console.log("[OrbitNavigation] navigation already active");
      return;
    }
    /*
    ========================================================
    DEPENDENCIES
    ========================================================
    */
    const manager = window?.App?.SceneManager;
    if (!manager) {
      console.warn("[OrbitNavigation] SceneManager not found");
      return;
    }
    const transition = window?.App?.TransitionLoader;
    if (!transition) {
      console.warn("[OrbitNavigation] TransitionLoader not found");
      return;
    }
    /*
    ========================================================
    SAME SCENE
    ========================================================
    */
    if (manager.getCurrentSceneName() === sceneName) {
      return;
    }
    /*
    ========================================================
    УНИВЕРСАЛЬНОЕ ПОЛУЧЕНИЕ ПОЗИЦИИ
    ========================================================
    */
    manager.refresh();
    const position = manager.getScenePosition(sceneName);

    if (!position) {
      console.warn(`[OrbitNavigation] Navigation position for "${sceneName}" not found`);
      return;
    }
    /*
    ========================================================
    TARGET
    ========================================================
    */
    const target = Math.max(0, position.start - this.config.offset);
    console.log(`[OrbitNavigation] ${sceneName} → ${Math.round(target)}px`);
    /*
    ========================================================
    LOCK
    ========================================================
    */
    this.isNavigating = true;
    document.documentElement.classList.add("scene-navigation-active");
    document.body.classList.add("scene-navigation-active");
    try {
      /*
      ======================================================
      COVER
      ======================================================
      */
      await transition.cover(sceneName);
      /*
      ======================================================
      NAVIGATION
      ======================================================
      */
      await this.scrollTo(target);
      /*
      ======================================================
      WAIT FOR SCROLL POSITION
      ======================================================
      */
      await this.nextFrames(2);
      /*
      ======================================================
      NORMAL SCENE ACTIVATION
      ======================================================
      */
      const scene = document.querySelector(`.scene[data-scene="${sceneName}"]`);
      if (scene) {
        manager.activate(scene, {
          source: "orbit"
        });
      }
      /*
      ======================================================
      REFRESH
      ======================================================
      */
      await this.nextFrames(2);
      ScrollTrigger.refresh();
      /*
      ======================================================
      REVEAL
      ======================================================
      */
      await transition.reveal();
    } catch (error) {
      console.error("[OrbitNavigation] transition failed", error);
      transition.finish();
    } finally {
      /*
      ======================================================
      RELEASE
      ======================================================
      */
      this.isNavigating = false;
      document.documentElement.classList.remove("scene-navigation-active");
      document.body.classList.remove("scene-navigation-active");
    }
  }

  /*
  ==========================================================
  SCROLL TO
  ==========================================================
  */
  scrollTo(target) {
    return new Promise(resolve => {
      /*
      ====================================================
      LENIS
      ====================================================
      */
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(target, {
          duration: this.config.duration,
          easing: t => 1 - Math.pow(1 - t, 4),
          immediate: false,
          force: true,
          onComplete: () => {
            // Проверяем точность позиции
            // const currentScroll = window.scrollY;
            // const diff = Math.abs(currentScroll - target);

            // if (diff > 1) {
            //   console.warn(`[OrbitNavigation] Scroll position mismatch: ${Math.round(currentScroll)} vs ${Math.round(target)}, correcting...`);
            //   window.scrollTo(0, target);
            // }

            ScrollTrigger.refresh();
            resolve();
          }
        });
        return;
      }
      /*
      ====================================================
      NATIVE FALLBACK
      ====================================================
      */
      const start = window.scrollY;
      const distance = target - start;
      const duration = this.config.duration * 1000;
      const started = performance.now();

      const animate = now => {
        const elapsed = now - started;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        const currentY = start + distance * eased;

        window.scrollTo(0, currentY);

        if (progress >= 1) {
          // Проверяем точность
          const currentScroll = window.scrollY;
          const diff = Math.abs(currentScroll - target);

          if (diff > 1) {
            console.warn(`[OrbitNavigation] Scroll position mismatch: ${Math.round(currentScroll)} vs ${Math.round(target)}, correcting...`);
            window.scrollTo(0, target);
          }

          ScrollTrigger.refresh();
          resolve();
          return;
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  }

  /*
  ==========================================================
  NEXT FRAMES
  ==========================================================
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
  ==========================================================
  GET ACTIVE SCENE
  ==========================================================
  */
  getActiveScene() {
    return this.activeScene;
  }
}