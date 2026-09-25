export default class ArchitectureBuilder {
  constructor(){
    console.log("[ArchitectureBuilder] ready")
    this.scene = document.querySelector(".scene-architecture");
    if (!this.scene) {
      console.warn('[ArchitectureBuilder] Not found scene!')
      return
    }

    this.map = this.scene?.querySelector(".architecture-map");
    this.progress = this.map?.querySelector(".architecture-progress");
    this.nodes = [
      ...this.map?.querySelectorAll(".architecture-node"),
      this.scene.querySelector('.cta-block')
    ];

    this.scrollTrigger = window?.App.SceneManager.scrollTrigger

    if (!this.scene) {
      console.warn("Architecture scene not found");
      return;
    }
    if (!this.progress) {
      console.warn("Architecture progress not found");
      return;
    }
    if (!this.nodes.length) {
      console.warn("Architecture nodes not found");
    }

    this.start()
  }

  start(){
    const length = this.progress.getTotalLength();
    console.log("Architecture line length:", length);
    this.progress.style.strokeDasharray = length;
    this.progress.style.strokeDashoffset = length;

    gsap.to(this.progress, {
      strokeDashoffset:0,
      ease:"none",
      scrollTrigger:{
        trigger: this.scene,
        start: this.scrollTrigger.start,
        end: this.scrollTrigger.bottom,
        scrub:1,
        onUpdate: (self) => {
          this.updateNodes(self.progress);
        },
      }
    });
  }
  updateNodes(progress) {
    const total = this.nodes.length;
    this.nodes.forEach((node, index) => {
      /*
       * Порог активации
       *
       * 5 nodes:
       *
       * Server       0.00
       * Application  0.20
       * Database     0.40
       * API          0.60
       * Cloud        0.80
       */
      const threshold = index / total;
      if (progress >= threshold) {
        node.classList.add("node-active");
      } else {
        node.classList.remove("node-active");
      }
    });
  }
}