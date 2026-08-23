/*
=====================================================
K·ART·MAKE V5.2

SCROLL ENGINE

Lenis + GSAP ScrollTrigger

=====================================================
*/
export default class ScrollEngine {
  constructor(){
    console.log("[ScrollEngine] ready")

    this.initLenis();
    this.initGSAP();
  }

  initLenis(){
    this.lenis = new Lenis({
      duration:1.2,
      smoothWheel:true,
    });

    window.lenis = this.lenis;

    const raf=(time)=>{
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  initGSAP(){
    gsap.registerPlugin(ScrollTrigger);
    this.lenis.on("scroll", ScrollTrigger.update);
  }

  scrollTo(target){
    this.lenis.scrollTo(target);
  }
}
