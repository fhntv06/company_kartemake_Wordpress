export default class PipelineScroll {
  constructor() {
    console.log("[PipelineScroll] ready")
    this.scene = document.querySelector(".scene-pipeline");
    if (!this.scene) {
      return;
    }
    this.line = this.scene.querySelector(".pipeline-line-progress");
    this.steps = [
      ...this.scene.querySelectorAll(".pipeline-step")
    ];
    this.progress = 0;

    this.scrollTrigger = window?.App?.SceneManager.scrollTrigger
    this.start()
  }

  start() {
    if (!this.scene) {
      console.warn("[PipelineScroll] Scene not found");
      return;
    }
    if (!this.line) {
      console.warn("[PipelineScroll] Progress line not found");
      return;
    }
    if (!this.steps.length) {
      console.warn("[PipelineScroll] Steps not found");
      return;
    }
    this.setup();
  }

  setup() {
    gsap.set(this.line, { height: "0%" });
    gsap.to(this.line, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: this.scene,
        start: this.scrollTrigger.start,
        end: this.scrollTrigger.bottom,
        scrub: 1,
        onUpdate: (self) => {
          this.progress = self.progress;
          this.updateSteps(self.progress);
        },
        onEnterBack: () => {
          this.updateSteps(1);
        },
        onLeave: () => {
          this.progress = 1;
          this.updateSteps(1);
        },
        onLeaveBack: () => {
          this.progress = 0;
          this.updateSteps(0);
        }
      }
    });
  }

  updateSteps(progress) {
    const total = this.steps.length;
    if (!total) {
      return;
    }
    this.steps.forEach((step, index) => {
      /*
       * 5 steps:
       *
       * Step 1 → 0.00
       * Step 2 → 0.20
       * Step 3 → 0.40
       * Step 4 → 0.60
       * Step 5 → 0.80
       */
      const threshold = index / total;
      if (progress >= threshold) {
        step.classList.add("step-active");
      } else {
        step.classList.remove("step-active");
      }
    });
  }
}