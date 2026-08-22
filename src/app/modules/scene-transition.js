export default class SceneTransition {
  constructor() {
    this.active = false;
    this.overlay = null;
    this.targetScene = null;
    this.duration = 0.9;
    this.ease = "power3.inOut";
    this.createOverlay();
  }

  /* =========================================================
     CREATE OVERLAY
  ========================================================= */
  createOverlay() {
    if (document.querySelector(".scene-transition")) {
      this.overlay = document.querySelector(".scene-transition");
      return;
    }
    this.overlay = document.createElement("div");
    this.overlay.className = "scene-transition";
    this.overlay.innerHTML = `
      <div class="scene-transition-inner">
        <div class="scene-transition-label">
          <span>TRANSITION</span>
        </div>
        <div class="scene-transition-status">
          <span class="scene-transition-dot"></span>
          <strong>LOADING TARGET</strong>
        </div>
        <div class="scene-transition-target"></div>
      </div>
    `;
    document.body.appendChild(this.overlay);
    gsap.set(this.overlay, {
      autoAlpha: 0,
      pointerEvents: "none"
    });
  }

  /* =========================================================
     GET SCENE
  ========================================================= */
  getScene(sceneName) {
    return document.querySelector(`.scene[data-scene="${sceneName}"]`);
  }

  /* =========================================================
     GET SCENE POSITION
  ========================================================= */
  getScenePosition(scene) {
    if (!scene) {
      return 0;
    }
    /*
     * Если у сцены есть ScrollTrigger,
     * используем его start.
     */
    const triggers = ScrollTrigger.getAll();
    for (const trigger of triggers) {
      if (trigger.trigger === scene || trigger.vars?.trigger === scene) {
        return trigger.start;
      }
    }
    /*
     * Fallback:
     * реальная позиция сцены в документе.
     */
    const rect = scene.getBoundingClientRect();
    return rect.top + window.scrollY;
  }

  /* =========================================================
     UPDATE TARGET LABEL
  ========================================================= */
  setTargetLabel(sceneName) {
    if (!this.overlay) {
      return;
    }
    const target = this.overlay.querySelector(".scene-transition-target");
    if (!target) {
      return;
    }
    const scene = this.getScene(sceneName);
    const index = scene?.dataset?.sceneIndex || "";
    target.textContent = index ? `${index} / ${sceneName.toUpperCase()}` : sceneName.toUpperCase();
  }

  /* =========================================================
     SHOW
  ========================================================= */
  show(sceneName) {
    if (!this.overlay) {
      return Promise.resolve();
    }
    this.setTargetLabel(sceneName);
    return new Promise(resolve => {
      gsap.killTweensOf(this.overlay);
      gsap.to(this.overlay, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: resolve
      });
    });
  }

  /* =========================================================
     HIDE
  ========================================================= */
  hide() {
    if (!this.overlay) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      gsap.to(this.overlay, {
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: resolve
      });
    });
  }

  /* =========================================================
     KILL SCROLL ANIMATIONS
  ========================================================= */
  pauseIntermediateScenes(targetScene) {
    const triggers = ScrollTrigger.getAll();
    triggers.forEach(trigger => {
      const triggerElement = trigger.trigger;
      if (!triggerElement) {
        return;
      }
      /*
       * Не трогаем target.
       */
      if (triggerElement === targetScene || targetScene.contains(triggerElement)) {
        return;
      }
      /*
       * Не убиваем trigger.
       *
       * Просто временно отключаем обновление.
       */
      trigger.disable(false, false);
    });
  }

  /* =========================================================
     RESTORE SCROLL TRIGGERS
  ========================================================= */
  restoreScenes() {
    ScrollTrigger.getAll().forEach(trigger => {
      if (!trigger.enabled) {
        trigger.enable(false, false);
      }
    });
    ScrollTrigger.refresh();
  }

  /* =========================================================
     SCROLL TO TARGET
  ========================================================= */
  scrollToPosition(position) {
    return new Promise(resolve => {
      /*
       * Lenis
       */
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(position, {
          duration: this.duration,
          easing: t => {
            return gsap.parseEase(this.ease)(t);
          },
          immediate: false,
          lock: true,
          force: true,
          onComplete: resolve
        });
        return;
      }
      /*
       * Native fallback
       */
      gsap.to(window, {
        scrollTo: position,
        duration: this.duration,
        ease: this.ease,
        overwrite: true,
        onComplete: resolve
      });
    });
  }

  /* =========================================================
     GO TO SCENE
  ========================================================= */
  async goTo(sceneName) {
    if (this.active) {
      return;
    }
    const scene = this.getScene(sceneName);
    if (!scene) {
      console.warn(`[SceneTransition] Scene "${sceneName}" not found`);
      return;
    }
    this.active = true;
    this.targetScene = sceneName;
    /*
     * Сразу показываем transition.
     */
    await this.show(sceneName);
    /*
     * Находим реальную позицию target.
     */
    const position = this.getScenePosition(scene);
    /*
     * Временно отключаем промежуточные ScrollTrigger.
     */
    this.pauseIntermediateScenes(scene);
    /*
     * Перемещаем страницу напрямую
     * к target.
     */
    await this.scrollToPosition(position);
    /*
     * Обновляем ScrollTrigger уже
     * после достижения target.
     */
    ScrollTrigger.refresh(true);
    /*
     * Даём браузеру один frame,
     * чтобы layout успел стабилизироваться.
     */
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
    /*
     * Сообщаем SceneManager,
     * какая сцена теперь активна.
     */
    window.dispatchEvent(new CustomEvent("sceneChange", {
      detail: {
        scene: sceneName,
        source: "orbit"
      }
    }));
    /*
     * Возвращаем обычную работу ScrollTrigger.
     */
    this.restoreScenes();
    /*
     * Скрываем transition.
     */
    await this.hide();
    this.targetScene = null;
    this.active = false;
  }
}
