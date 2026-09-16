/*
==========================================================
K·ART·MAKE V5.2
SCENE MANAGER
==========================================================

Responsibilities:

- Scene registration
- Normal scene ScrollTriggers
- Scene active state
- Scene change events
- Engine lifecycle
- Navigation positions
- Preloader-safe startup

==========================================================
*/
export default class SceneManager {
  constructor() {
    console.log("[SceneManager] ready")

    this.scenes = [];
    this.engines = new Map();
    this.triggers = [];
    /*
    Navigation positions.

    {
      hero: {
        scene,
        start,
        end
      }
    }
    */
    this.positions = new Map();
    this.customPositions = new Set();
    this.currentScene = null;
    this.started = false;
    this.scrollTrigger = {
      start: 'top 35%',
      bottom: 'bottom 55%',
    }
  }

  /*
  ==========================================================
  INIT
  ==========================================================
  */
  init() {
    this.scenes = Array.from(document.querySelectorAll(".scene[data-scene]"));
    console.log(`[SceneManager] ${this.scenes.length} scenes found`);
    if (window?.App?.SceneRegistry) {
      window.App.SceneRegistry.refresh();
    }
    return this;
  }

  /*
  ==========================================================
  REGISTER ENGINE
  ==========================================================
  */
  register(sceneName, engine) {
    if (!sceneName) {
      console.warn("[SceneManager] Cannot register engine without scene name");
      return this;
    }
    if (!engine) {
      console.warn(`[SceneManager] Engine for "${sceneName}" is empty`);
      return this;
    }
    this.engines.set(sceneName, engine);
    console.log(`[SceneManager] Engine registered: ${sceneName}`);
    return this;
  }

  /*
  ==========================================================
  START
  ==========================================================
  */
  start() {
    if (this.started) {
      return this;
    }
    if (typeof ScrollTrigger === "undefined") {
      console.error("[SceneManager] ScrollTrigger is not available");
      return this;
    }
    if (!this.scenes.length) {
      this.init();
    }
    this.started = true;
    this.createTriggers();
    ScrollTrigger.refresh();
    /*
    Calculate normal scene positions
    AFTER refresh.
    */
    this.updatePositions();

    this.engines.forEach((engine) => {
      if (typeof engine.refresh === "function") {
        engine.refresh();
      }
    })

    console.log("[SceneManager] started");
    return this;
  }

  /*
  ==========================================================
  CREATE SCROLL TRIGGERS
  ==========================================================
  */
  createTriggers() {
    this.destroyTriggers();
    this.scenes.forEach((scene) => {
      const trigger = this.createSceneTrigger(scene);
      if (trigger) {
        this.triggers.push(trigger);
      }
    });
  }

  /*
  ==========================================================
  CREATE NORMAL SCENE TRIGGER
  ==========================================================
  */
  createSceneTrigger(scene) {
    const sceneName = scene.dataset.scene;
    if (!sceneName) {
      return null;
    }
    return ScrollTrigger.create({
      trigger: scene,
      start: this.scrollTrigger.start,
      end: this.scrollTrigger.bottom,
      onEnter: () => {
        this.activate(scene);
      },
      onEnterBack: () => {
        this.activate(scene);
      }
    });
  }

  /*
  ==========================================================
  UPDATE POSITIONS
  ==========================================================
  */
  updatePositions() {
    this.scenes.forEach((scene) => {
      const sceneName = scene.dataset.scene;

      if (!sceneName) {
        return;
      }

      /*
      ------------------------------------------------------
      CUSTOM POSITION

      Если позиция зарегистрирована специализированным
      engine — SceneManager НЕ имеет права её перезаписывать.

      ------------------------------------------------------
      */
      if (this.customPositions.has(sceneName)) {
        return;
      }

      const rect = scene.getBoundingClientRect();

      const start = window.scrollY + rect.top;
      const end = start + rect.height;

      this.positions.set(sceneName, {
        scene,
        start,
        end
      });
    });

    console.table(
      Array.from(this.positions.entries()).map(
        ([scene, data]) => ({
          scene,
          start: Math.round(data.start),
          end: Math.round(data.end),
          custom: this.customPositions.has(scene)
        })
      )
    );

    return this.positions;
  }

  /*
  ==========================================================
  REGISTER CUSTOM NAVIGATION POSITION
  ==========================================================

  Used by engines which have their own
  internal scroll system.

  This overrides the physical DOM position.
  ==========================================================
  */
  registerScenePosition(sceneName, start, end = null) {
    if (!sceneName) {
      return;
    }
    const scene = document.querySelector(`.scene[data-scene="${sceneName}"]`);
    if (!scene) {
      console.warn(`[SceneManager] Scene "${sceneName}" not found`);
      return;
    }
    this.customPositions.add(sceneName);
    this.positions.set(sceneName, {
      scene,
      start,
      end: end !== null ? end : start
    });
    console.log(`[SceneManager] navigation position registered: ${sceneName} → ${Math.round(start)}`);
  }

  /*
  ==========================================================
  GET SCENE POSITION
  ==========================================================
  */
  getScenePosition(sceneName) {
    if (!this.positions.size) {
      this.updatePositions();
    }
    return this.positions.get(sceneName) || null;
  }

  /*
  ==========================================================
  GET SCENE START
  ==========================================================
  */
  getSceneStart(sceneName) {
    const position = this.getScenePosition(sceneName);
    if (!position) {
      return null;
    }
    return position.start;
  }

  /*
  ==========================================================
  ACTIVATE SCENE
  ==========================================================
  */
  activate(scene, options = {}) {
    if (!scene) {
      return;
    }
    const sceneName = scene.dataset.scene;
    if (!sceneName) {
      return;
    }
    /*
    --------------------------------------------------------
    Already active
    --------------------------------------------------------
    */
    if (this.currentScene === scene && !options.force) {
      return;
    }
    /*
    --------------------------------------------------------
    Remove active state
    --------------------------------------------------------
    */
    this.scenes.forEach(item => {
      item.classList.remove("scene-active");
    });
    /*
    --------------------------------------------------------
    Activate target
    --------------------------------------------------------
    */
    scene.classList.add("scene-active");
    /*
    IMPORTANT:

    sceneActivated is dispatched BEFORE
    engine.start(), exactly as your architecture
    expects.
    */
    scene.dispatchEvent(
      new CustomEvent("sceneActivated", {
        detail: {
          scene: sceneName,
          source: options.source || "scroll"
        }
      })
    );

    if (this.currentScene && this.currentScene !== scene) {
      this.currentScene.dispatchEvent(
        new CustomEvent("sceneDeactivated", {
          detail: {
            scene: this.currentScene.dataset.scene,
            nextScene: sceneName
          }
        })
      );
    }

    /*
    --------------------------------------------------------
    Engine
    --------------------------------------------------------
    */
    this.startEngine(sceneName);
    /*
    --------------------------------------------------------
    Global event
    --------------------------------------------------------
    */
    window.dispatchEvent(
      new CustomEvent("sceneChange", {
        detail: {
          scene: sceneName,
          element: scene,
          source: options.source || "scroll"
        }
      })
    );
    console.log(`[SceneManager] active scene: ${sceneName}`);

    this.currentScene = scene;
  }

  /*
  ==========================================================
  START ENGINE
  ==========================================================
  */
  startEngine(sceneName) {
    const engine = this.engines.get(sceneName);
    if (!engine) {
      return;
    }
    if (typeof engine.start !== "function") {
      console.warn(`[SceneManager] Engine "${sceneName}" has no start() method`);
      return;
    }
    engine.start();
  }

  /*
  ==========================================================
  GET CURRENT SCENE
  ==========================================================
  */
  getCurrentScene() {
    return this.currentScene;
  }

  getCurrentSceneName() {
    if (!this.currentScene) {
      return null;
    }
    return this.currentScene.dataset.scene || null;
  }

  /*
  ==========================================================
  REFRESH
  ==========================================================
  */
  refresh() {
    if (!this.started) {
      return;
    }
    ScrollTrigger.refresh();
    this.updatePositions();
    /*
    Allow custom engines to
    re-register their positions.
    */
    this.engines.forEach((engine) => {
      if (typeof engine.refresh === "function") {
        engine.refresh();
      }
    });
  }

  /*
  ==========================================================
  DESTROY TRIGGERS
  ==========================================================
  */
  destroyTriggers() {
    this.triggers.forEach((trigger) => {
      if (trigger) {
        trigger.kill();
      }
    });
    this.triggers = [];
  }

  /*
  ==========================================================
  STOP ==========================================================
  */
  stop() {
    this.destroyTriggers();
    this.scenes.forEach((scene) => {
      scene.classList.remove("scene-active");
    });
    this.positions.clear();
    this.customPositions.clear();
    this.currentScene = null;
    this.started = false;
    console.log("[SceneManager] stopped");
  }
}