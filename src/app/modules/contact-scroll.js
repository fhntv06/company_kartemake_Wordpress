/*
==========================================================
K·ART·MAKE V5.2
CONTACT SCROLL
==========================================================

Contact теперь самостоятельная сцена со своим ScrollTrigger.
==========================================================
*/
export default class ContactScroll {
  constructor() {
    console.log("[ContactScroll] ready")
    this.scene = document.querySelector(".scene-contact");
    if (!this.scene) {
      console.warn("[ContactScroll] Scene not found");
      return;
    }

    this.scrollTrigger = window?.App?.SceneManager.scrollTrigger

    this.init();
  }

  /*
  ==========================================================
  INIT
  ==========================================================
  */
  init() {
    // Создаём ScrollTrigger для Contact
    ScrollTrigger.create({
      trigger: this.scene,
      start: this.scrollTrigger.start,
      end: this.scrollTrigger.bottom,
      onEnter: () => {
        this.activate();
      },
      onLeave: () => {
        this.deactivate();
      },
      onEnterBack: () => {
        this.activate();
      },
      onLeaveBack: () => {
        this.deactivate();
      }
    });

    // Обновляем registry после создания
    if (window?.App?.SceneManager) {
      window?.App?.SceneManager.refresh();
    }

    console.log("[ContactScroll] initialized");
  }

  /*
  ==========================================================
  ACTIVATE
  ==========================================================
  */
  activate() {
    if (this.scene.classList.contains("scene-active")) {
      return;
    }
    this.scene.classList.add("scene-active");
    this.scene.dispatchEvent(new CustomEvent("sceneActivated"));
    console.log("[ContactScroll] Contact activated");
  }

  /*
  ==========================================================
  DEACTIVATE
  ==========================================================
  */
  deactivate() {
    if (!this.scene.classList.contains("scene-active")) {
      return;
    }
    this.scene.classList.remove("scene-active");
    this.scene.dispatchEvent(new CustomEvent("sceneDeactivated"));
    console.log("[ContactScroll] Contact deactivated");
  }

  /*
  ==========================================================
  DESTROY
  ==========================================================
  */
  destroy() {
    // Находим и убиваем ScrollTrigger для этой сцены
    const triggers = ScrollTrigger.getAll();
    triggers.forEach(trigger => {
      if (trigger.trigger === this.scene) {
        trigger.kill();
      }
    });
    this.scene.classList.remove("scene-active");
    console.log("[ContactScroll] destroyed");
  }
}