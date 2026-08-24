/*
=====================================================
K·ART·MAKE V5.2

SCROLL ENGINE

Global scroll controller

Responsibilities:
- Lenis initialization
- Smooth scrolling
- ScrollTo API

Does NOT initialize:
- GSAP
- ScrollTrigger

GSAP / ScrollTrigger are page-specific
and initialized by the corresponding page entry.

=====================================================
*/
import '../lib/lenis.min.js'

export default class ScrollEngine {
  constructor() {
    console.log("[ScrollEngine] ready");
    this.lenis = null;
    this.rafId = null;
    this.initLenis();
  }

  /*
  =====================================================
  LENIS
  =====================================================
  */
  initLenis() {
    if (typeof Lenis === "undefined") {
      console.warn("[ScrollEngine] Lenis is not loaded");
      return;
    }
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0

    this.lenis = new Lenis({
      duration: isTouch ? 2.5 : 1.5,
      smoothWheel: !isTouch,
      syncTouch: true,
    })
    /*
    -----------------------------------------------------
    Global reference
    -----------------------------------------------------
    */
    window.lenis = this.lenis;
    /*
    -----------------------------------------------------
    RAF
    -----------------------------------------------------
    */
    const raf = (time) => {
      if (!this.lenis) {
        return;
      }
      this.lenis.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
    console.log("[ScrollEngine] Lenis initialized");
  }

  /*
  =====================================================
  SCROLL TO
  =====================================================
  */
  scrollTo(target, options = {}) {
    if (!this.lenis) {
      console.warn("[ScrollEngine] Lenis is not initialized");
      return;
    }
    this.lenis.scrollTo(target, options);
  }

  /*
  =====================================================
  STOP
  =====================================================
  */
  stop() {
    if (!this.lenis) {
      return;
    }
    this.lenis.stop();
  }

  /*
  =====================================================
  START
  =====================================================
  */
  start() {
    if (!this.lenis) {
      return;
    }
    this.lenis.start();
  }

  /*
  =====================================================
  DESTROY
  =====================================================
  */
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    window.lenis = null;
    console.log("[ScrollEngine] destroyed");
  }
}