/*
==========================================================
K·ART·MAKE V5.2
SCENE REGISTRY

Responsibilities:
- хранение сцен
- получение реальных ScrollTrigger
- получение start/end обычных сцен
==========================================================
*/
export default class SceneRegistry {
  constructor() {
    this.scenes = new Map();
    // ❌❌❌ УДАЛИТЬ this.positions ❌❌❌
    // this.positions = new Map();
    this.collectScenes();
  }

  /* =========================================================
     COLLECT SCENES
  ========================================================= */
  collectScenes() {
    const scenes = Array.from(document.querySelectorAll(".scene[data-scene]"));
    scenes.forEach(scene => {
      const name = scene.dataset.scene;
      if (!name) {
        return;
      }
      this.scenes.set(name, {
        name,
        element: scene,
        trigger: null,
        start: null,
        end: null
      });
    });
    console.log(`[SceneRegistry] ${this.scenes.size} scenes registered`);
  }

  /* =========================================================
     REFRESH
  ========================================================= */
  refresh() {
    if (typeof ScrollTrigger === "undefined") {
      console.warn("[SceneRegistry] ScrollTrigger is not available");
      return;
    }
    this.scenes.forEach(entry => {
      const trigger = this.findTrigger(entry.element);
      entry.trigger = trigger;
      if (!trigger) {
        entry.start = null;
        entry.end = null;
        return;
      }
      entry.start = trigger.start;
      entry.end = trigger.end;
    });
    // ❌❌❌ УДАЛИТЬ refreshRegisteredPositions ❌❌❌
    // this.refreshRegisteredPositions();
  }

  /* =========================================================
     FIND TRIGGER
  ========================================================= */
  findTrigger(scene) {
    const triggers = ScrollTrigger.getAll();
    return (
      triggers.find(trigger => trigger.trigger === scene) || null
    );
  }

  /* =========================================================
     ❌❌❌ УДАЛИТЬ МЕТОДЫ ДЛЯ POSITIONS ❌❌❌
  ========================================================= */
  // registerPosition(name, position) {
  //   if (!name) return;
  //   if (!Number.isFinite(position)) {
  //     console.warn(`[SceneRegistry] Invalid position for "${name}":`, position);
  //     return;
  //   }
  //   this.positions.set(name, position);
  //   console.log(`[SceneRegistry] position registered: ${name} → ${Math.round(position)}`);
  // }

  // refreshRegisteredPositions() {
  //   this.positions.forEach((position, name) => {
  //     const entry = this.scenes.get(name);
  //     if (!entry) return;
  //     if (entry.start !== null) {
  //       this.positions.set(name, entry.start);
  //     }
  //   });
  // }

  /* =========================================================
     GET SCENE
  ========================================================= */
  get(sceneName) {
    return this.scenes.get(sceneName) || null;
  }

  /* =========================================================
     GET POSITION
  ========================================================= */
  getPosition(sceneName) {
    // ❌❌❌ УДАЛИТЬ СПЕЦИАЛЬНУЮ ПРОВЕРКУ ПОЗИЦИЙ ❌❌❌
    // if (this.positions.has(sceneName)) {
    //   return this.positions.get(sceneName);
    // }
    const scene = this.get(sceneName);
    if (!scene) {
      console.warn(`[SceneRegistry] Scene "${sceneName}" not found`);
      return null;
    }
    if (scene.start === null) {
      console.warn(`[SceneRegistry] Scene "${sceneName}" has no position`);
      return null;
    }
    return scene.start;
  }

  /* =========================================================
     GET ELEMENT
  ========================================================= */
  getElement(sceneName) {
    return this.get(sceneName)?.element || null;
  }

  /* =========================================================
     HAS
  ========================================================= */
  has(sceneName) {
    return this.scenes.has(sceneName);
  }

  /* =========================================================
     DEBUG
  ========================================================= */
  debug() {
    console.table(
      Array.from(this.scenes.values()).map(scene => ({
        scene: scene.name,
        start: scene.start !== null ? Math.round(scene.start) : null,
        end: scene.end !== null ? Math.round(scene.end) : null,
        trigger: !!scene.trigger
      }))
    );
  }
}
