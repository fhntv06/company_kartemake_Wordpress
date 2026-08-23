/*
==========================================================
K·ART·MAKE V5.2
MONITORING SCROLL
==========================================================

PIPELINE:

    MONITORING
        │
        ▼
    CARD 1
        │
        ▼
    STACK 1
        │
        ▼
    CARD 2
        │
        ▼
       ...
        │
        ▼
    COMPLETE


ARCHITECTURE:

ScrollTrigger
      ↓
scroll progress
      ↓
timeline.progress(progress)
      ↓
┌─────────────────────────────┐
│ CARDS                       │
│ STACK                       │
│ COMPLETE                    │
└─────────────────────────────┘


IMPORTANT:

MonitoringScroll owns the single
ScrollTrigger for monitoring.

SceneManager must NOT create another
ScrollTrigger for:

- monitoring
==========================================================
*/
export default class MonitoringScroll {
  constructor() {
    console.log("[MonitoringScroll] ready")
    this.scene = document.querySelector(".scene-monitoring");
    if (!this.scene) {
      return;
    }
    /*
    ========================================================
    DOM
    ========================================================
    */
    this.pin = this.scene.querySelector(".monitoring-pin");
    this.viewport = this.scene.querySelector(".monitoring-viewport");
    this.track = this.scene.querySelector(".monitoring-track");
    this.cards = [
      ...this.scene.querySelectorAll(".monitor-card")
    ];
    this.stack = this.scene.querySelector(".monitoring-stack-items");
    this.complete = this.scene.querySelector(".monitoring-complete");
    /*
    ========================================================
    STATE
    ========================================================
    */
    this.timeline = null;
    this.scrollTrigger = null;
    this.initialized = false;
    this.isMobile = window.innerWidth <= 768;
    /*
    ========================================================
    PIPELINE CONFIGURATION
    ========================================================
    */
    this.pipeline = {
      /*
      ------------------------------------------------------
      PIN
      ------------------------------------------------------
      */
      firstCardThreshold: 0.03,
      /*
      ------------------------------------------------------
      STACK
      ------------------------------------------------------
      */
      stackAnimation: 0.45,
      /*
      ------------------------------------------------------
      CARDS
      ------------------------------------------------------
      */
      cards: {
        enter: 1.4,
        hold: 1.8,
        exit: 1.2,
        gap: 0.35
      },
      /*
      ------------------------------------------------------
      COMPLETE
      ------------------------------------------------------
      */
      complete: {
        animation: 1.4,
        hold: 1.2,
        ease: "power2.inOut"
      }
    };
    /*
    ========================================================
    INIT
    ========================================================
    */
    this.init();
  }

  /*
  ==========================================================
  INIT
  ==========================================================
  */
  init() {
    if (this.initialized) {
      return;
    }
    if (!this.pin || !this.viewport || !this.track || !this.cards.length) {
      console.warn("[MonitoringScroll] Required elements not found");
      return;
    }
    this.prepare();
    this.createStack();
    this.createTimeline();
    this.initialized = true;
    console.log("[MonitoringScroll] initialized");
  }

  /*
  ==========================================================
  PREPARE
  ==========================================================
  */
  prepare() {
    /*
    --------------------------------------------------------
    CARDS
    --------------------------------------------------------
    */
    this.cards.forEach(card => {
      gsap.set(card, {
        x: window.innerWidth * 1.15,
        y: 0,
        scale: 0.72,
        rotate: 8,
        opacity: 0
      });
    });
    /*
    --------------------------------------------------------
    COMPLETE
    --------------------------------------------------------
    */
    if (this.complete) {
      gsap.set(this.complete, {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        y: 40
      });
    }

    /*
    --------------------------------------------------------
    STACK
    --------------------------------------------------------
    */
    if (this.stack) {
      this.stack.innerHTML = "";
    }
  }

  /*
  ==========================================================
  CREATE STACK
  ==========================================================
  */
  createStack() {
    if (!this.stack) {
      return;
    }
    this.cards.forEach((card, index) => {
      const label = card.querySelector(".monitor-card-label")?.textContent?.trim() || `MONITOR ${index + 1}`;
      const metric = card.querySelector(".monitor-card-metric")?.textContent?.trim() || "";
      const item = document.createElement("div");
      item.className = "monitor-stack-card";
      item.innerHTML = `
        <span>${label}</span>
        <strong>${metric}</strong>
      `;
      gsap.set(item, {
        opacity: 0,
        scale: 0.4,
        x: -70,
        transformOrigin: "left center"
      });
      this.stack.appendChild(item);
    });
  }

  /*
  ==========================================================
  CREATE TIMELINE
  ==========================================================
  */
  createTimeline() {
    this.timeline = gsap.timeline({
      paused: true
    });
    /*
    ========================================================
    CARDS
    ========================================================
    */
    this.cards.forEach((card, index) => {
      this.createCardSequence(card, index);
    });
    /*
    ========================================================
    COMPLETE
    ========================================================
    */
    const cardsEnd = this.getCardsTimelineDuration();
    const completeStart = cardsEnd;
    if (this.complete) {
      /*
      ------------------------------------------------------
      COMPLETE ENTER
      ------------------------------------------------------
      */
      this.timeline.to(this.complete, {
        opacity: 1,
        y: 0,
        duration: this.pipeline.complete.animation,
        ease: this.pipeline.complete.ease
      }, completeStart);
      /*
      ------------------------------------------------------
      COMPLETE HOLD
      ------------------------------------------------------
      */
      this.timeline.to({}, {
        duration: this.pipeline.complete.hold,
        ease: "none"
      }, completeStart + this.pipeline.complete.animation);
    }
    /*
    ========================================================
    SCROLL DISTANCE
    ========================================================
    */
    const scrollDistance = this.getScrollDistance();
    /*
    ========================================================
    SCROLL TRIGGER
    ========================================================
    */
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.scene,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: this.pin,
      pinSpacing: true,
      scrub: 1.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      /*
      ----------------------------------------------------
      UPDATE
      ----------------------------------------------------
      */
      onUpdate: self => {
        this.applyProgress(self.progress);
      },
      /*
      ----------------------------------------------------
      LEAVE BACK
      ----------------------------------------------------
      */
      onLeaveBack: () => {
        this.applyProgress(0);
        this.pin?.classList.remove("monitoring-pin__active");
      },
      /*
      ----------------------------------------------------
      LEAVE
      ----------------------------------------------------
      */
      onLeave: () => {
        this.applyProgress(1);
      }
    });
    /*
    ========================================================
    REFRESH
    ========================================================
    */
    ScrollTrigger.refresh();
    /*
    ========================================================
    NAVIGATION
    ========================================================
    */
    this.registerNavigationPositions();
    /*
    ========================================================
    DEBUG
    ========================================================
    */
    console.log("[MonitoringScroll] timeline duration:", this.timeline.duration());
    console.log("[MonitoringScroll] cards duration:", cardsEnd);
  }

  /*
  ==========================================================
  APPLY PROGRESS
  ==========================================================

  ЕДИНСТВЕННОЕ место, которое синхронизирует
  ScrollTrigger → timeline.

  ==========================================================
  */
  applyProgress(progress) {
    if (!this.timeline) {
      return;
    }
    const normalized = gsap.utils.clamp(0, 1, progress);
    this.timeline.progress(normalized);
    this.updatePipeline(normalized);
  }

  /*
  ==========================================================
  GET SCROLL DISTANCE
  ==========================================================
  */
  getScrollDistance() {
    return Math.max(6400, this.cards.length * 1000);
  }

  /*
  ==========================================================
  GET CARDS TIMELINE DURATION
  ==========================================================
  */
  getCardsTimelineDuration() {
    const { enter, hold, exit, gap } = this.pipeline.cards;
    if (!this.cards.length) {
      return 0;
    }
    const cardDuration = enter + hold + exit;
    const cardsDuration = this.cards.length * cardDuration;
    const gapsDuration = (this.cards.length - 1) * gap;
    const stackDuration = this.pipeline.stackAnimation;
    return cardsDuration + gapsDuration + stackDuration;
  }

  /*
  ==========================================================
  CREATE CARD SEQUENCE
  ==========================================================
  */
  createCardSequence(card, index) {
    const stackCard = this.stack?.children[index];
    const { enter, hold, exit, gap } = this.pipeline.cards;
    const cardDuration = enter + hold + exit;
    const start = index * (cardDuration + gap);
    /*
    --------------------------------------------------------
    ENTER
    --------------------------------------------------------
    */
    this.timeline.to(card, {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      duration: enter,
      ease: "power2.inOut"
    }, start);
    /*
    --------------------------------------------------------
    HOLD
    --------------------------------------------------------
    */
    this.timeline.to(card, {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      duration: hold,
      ease: "none"
    }, start + enter);
    /*
    --------------------------------------------------------
    EXIT
    --------------------------------------------------------
    */
    this.timeline.to(card, {
      x: () => -window.innerWidth * 0.40,
      y: () => -window.innerHeight * 0.32,
      scale: 0.22,
      rotate: -7,
      opacity: 0,
      duration: exit,
      ease: "power2.inOut"
    }, start + enter + hold);
    /*
    --------------------------------------------------------
    STACK
    --------------------------------------------------------
    */
    if (stackCard) {
      this.timeline.to(stackCard, {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: this.pipeline.stackAnimation,
        ease: "power2.out"
      }, start + enter + hold + exit);
    }
  }

  /*
  ==========================================================
  UPDATE PIPELINE
  ==========================================================

  Здесь НЕ управляются COMPLETE
  отдельно.

  Всё состояние приходит
  из timeline.

  ==========================================================
  */
  updatePipeline(progress) {
    if (!this.pin) {
      return;
    }
    const threshold = this.pipeline.firstCardThreshold;
    this.pin.classList.toggle("monitoring-pin__active", progress >= threshold);
  }

  /*
  ==========================================================
  REGISTER NAVIGATION POSITIONS
  ==========================================================
  */
  registerNavigationPositions() {
    if (!this.scrollTrigger) {
      return;
    }
    if (!window?.App?.SceneManager) {
      return;
    }
    /*
    ========================================================
    MONITORING
    ========================================================
    */
    const monitoringStart = this.scrollTrigger.start;
    const monitoringEnd = this.scrollTrigger.end;
    window?.App?.SceneManager.registerScenePosition("monitoring", monitoringStart, monitoringEnd);
  }

  /*
  ==========================================================
  REFRESH
  ==========================================================
  */
  refresh() {
    if (!this.scrollTrigger) {
      return;
    }
    ScrollTrigger.refresh();
    this.registerNavigationPositions();
  }

  /*
  ==========================================================
  DESTROY
  ==========================================================
  */
  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    this.pin?.classList.remove("monitoring-pin__active");
    this.initialized = false;
  }

  /*
  ==========================================================
  START
  ==========================================================
  */
  start() {
    if (this.initialized) {
      return;
    }
    this.init();
  }
}