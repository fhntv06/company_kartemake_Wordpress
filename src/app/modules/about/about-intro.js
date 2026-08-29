/*
==========================================================
K·ART·MAKE
ABOUT INTRO ENGINE
==========================================================

Visual metaphor:

BUSINESS
   ↓
TECHNICAL REQUEST
   ↓
K·ART·MAKE CORE
   ↓
ENGINEERING SERVICES
   ↓
RESULT
   ↓
BUSINESS

Responsibilities:

- Scene activation lifecycle
- Process animation
- Technical data-flow animation
- Core activation
- Service highlighting
- Mouse interaction
- Responsive-safe animation

Does NOT:

- create ScrollTriggers
- use IntersectionObserver
- manage scene state

SceneManager controls lifecycle through:

sceneActivated
sceneDeactivated
==========================================================
*/
export default class AboutIntro {
    constructor() {
        console.log("[AboutIntro] ready");
        this.scene = document.querySelector('.scene[data-scene="about-intro"]');
        if (!this.scene) {
            console.warn("[AboutIntro] Scene not found");
            return;
        }
        this.visual = this.scene.querySelector(".about-intro-visual");
        if (!this.visual) {
            console.warn("[AboutIntro] Visual not found");
            return;
        }
        /*
        ------------------------------------------------------
        CORE
        ------------------------------------------------------
        */
        this.system = this.visual.querySelector(".about-intro-system");
        this.core = this.visual.querySelector(".about-intro-system-core");
        /*
        ------------------------------------------------------
        BUSINESS
        ------------------------------------------------------
        */
        this.business = this.visual.querySelector(".about-intro-business");
        /*
        ------------------------------------------------------
        CONNECTORS
        ------------------------------------------------------
        */
        this.connectors = Array.from(this.visual.querySelectorAll(".about-intro-connector"));
        /*
        ------------------------------------------------------
        SERVICES
        ------------------------------------------------------
        */
        this.services = Array.from(this.visual.querySelectorAll(".about-intro-service"));
        /*
        ------------------------------------------------------
        RESULT
        ------------------------------------------------------
        */
        this.result = this.visual.querySelector(".about-intro-result");
        /*
        ------------------------------------------------------
        PARTICLE CONTAINER
        ------------------------------------------------------
        */
        this.particleContainer = this.visual.querySelector(".about-intro-particles");
        /*
        ------------------------------------------------------
        STATE
        ------------------------------------------------------
        */
        this.timeline = null;
        this.processTimeline = null;
        this.started = false;
        this.interactive = false;
        this.processIndex = 0;
        /*
        ------------------------------------------------------
        BIND EVENTS
        ------------------------------------------------------
        */
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this.init();
    }

    /*
    ==========================================================
    INIT
    ==========================================================
    */
    init() {
        if (!this.scene || !this.visual) {
            return this;
        }
        /*
        ------------------------------------------------------
        Scene lifecycle
        ------------------------------------------------------
        */
        this.scene.addEventListener("sceneActivated", () => this.start());
        this.scene.addEventListener("sceneDeactivated", () => this.stop());
        /*
        ------------------------------------------------------
        If scene already active
        ------------------------------------------------------
        */
        if (this.scene.classList.contains("scene-active")) {
            this.start();
        }
        return this;
    }

    /*
    ==========================================================
    START
    ==========================================================
    */
    start() {
        console.log('start')
        if (this.started) {
            return this;
        }
        if (!this.visual) {
            return this;
        }
        console.log("[AboutIntro] start");
        this.started = true;
        this.reset();
        /*
        ------------------------------------------------------
        INTRO
        ------------------------------------------------------
        */
        this.timeline = gsap.timeline({
            onComplete: () => {
                this.startProcess();
                this.enableInteraction();
            }
        });
        /*
        BUSINESS
        */
        if (this.business) {
            this.timeline.fromTo(this.business, {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            });
        }
        /*
        CONNECTORS
        */
        if (this.connectors.length) {
            this.timeline.fromTo(this.connectors, {
                scaleY: 0,
                transformOrigin: "top center"
            }, {
                scaleY: 1,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.3");
        }
        /*
        CORE
        */
        if (this.core) {
            this.timeline.fromTo(this.core, {
                opacity: 0,
                scale: 0.85,
                y: 15
            }, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.2");
        }
        /*
        SERVICES
        */
        if (this.services.length) {
            this.timeline.fromTo(this.services, {
                opacity: 0,
                y: 10
            }, {
                opacity: 0.4,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.3");
        }
        /*
        RESULT
        */
        if (this.result) {
            this.timeline.fromTo(this.result, {
                opacity: 0,
                y: 10
            }, {
                opacity: 0.4,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.2");
        }
        return this;
    }

    /*
    ==========================================================
    PROCESS
    ==========================================================

    Repeating technical workflow:

    BUSINESS
       ↓
    CORE
       ↓
    SERVICE
       ↓
    RESULT
       ↓
    BUSINESS
    ==========================================================
    */
    startProcess() {
        this.stopProcess();
        if (!this.particleContainer) {
            console.warn("[AboutIntro] Particle container not found");
            return;
        }
        /*
        ------------------------------------------------------
        Create data packets
        ------------------------------------------------------
        */
        this.createPackets();
        /*
        ------------------------------------------------------
        Main process timeline
        ------------------------------------------------------
        */
        this.processTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 1.8
        });
        /*
        ------------------------------------------------------
        REQUEST
        ------------------------------------------------------
        */
        this.processTimeline.call(() => this.activateBusiness(), null, 0);
        this.processTimeline.call(() => this.animateRequest(), null, 0.15);
        /*
        ------------------------------------------------------
        CORE
        ------------------------------------------------------
        */
        this.processTimeline.call(() => this.activateCore(), null, 1.2);
        /*
        ------------------------------------------------------
        SERVICES
        ------------------------------------------------------
        */
        this.services.forEach((service, index) => {
            this.processTimeline.call(() => {
                this.activateService(service);
                this.sendServicePacket(service, index);
            }, null, 1.55 + index * 0.65);
        });
        /*
        ------------------------------------------------------
        RESULT
        ------------------------------------------------------
        */
        const resultTime = 1.55 + this.services.length * 0.65 + 0.8;
        this.processTimeline.call(() => this.activateResult(), null, resultTime);
        /*
        ------------------------------------------------------
        RETURN TO BUSINESS
        ------------------------------------------------------
        */
        this.processTimeline.call(() => this.animateReturn(), null, resultTime + 0.5);
    }

    /*
    ==========================================================
    CREATE PACKETS
    ==========================================================
    */
    createPackets() {
        /*
        Remove previous generated packets
        */
        this.particleContainer.querySelectorAll(".about-intro-packet").forEach(packet => packet.remove());
        /*
        Main request packets
        */
        for (let i = 0; i < 3; i++) {
            const packet = document.createElement("span");
            packet.className = "about-intro-particle about-intro-packet";
            packet.dataset.packet = String(i);
            this.particleContainer.appendChild(packet);
        }
        this.packets = Array.from(this.particleContainer.querySelectorAll(".about-intro-packet"));
        gsap.set(this.packets, {
            opacity: 0
        });
    }

    /*
    ==========================================================
    REQUEST ANIMATION
    ==========================================================
    */
    animateRequest() {
        if (!this.business || !this.core) {
            return;
        }
        const businessRect = this.business.getBoundingClientRect();
        const coreRect = this.core.getBoundingClientRect();
        const visualRect = this.visual.getBoundingClientRect();
        const startX = businessRect.left + businessRect.width / 2 - visualRect.left;
        const startY = businessRect.top + businessRect.height / 2 - visualRect.top;
        const endX = coreRect.left + coreRect.width / 2 - visualRect.left;
        const endY = coreRect.top + coreRect.height / 2 - visualRect.top;
        this.packets.forEach((packet, index) => {
            gsap.set(packet, {
                x: startX,
                y: startY,
                opacity: 0
            });
            gsap.to(packet, {
                x: endX,
                y: endY,
                opacity: 1,
                duration: 0.9,
                delay: index * 0.13,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.to(packet, {
                        opacity: 0,
                        duration: 0.15
                    });
                }
            });
        });
    }

    /*
    ==========================================================
    SERVICE PACKET
    ==========================================================
    */
    sendServicePacket(service, index) {
        if (!this.core || !service) {
            return;
        }
        const coreRect = this.core.getBoundingClientRect();
        const serviceRect = service.getBoundingClientRect();
        const visualRect = this.visual.getBoundingClientRect();
        const startX = coreRect.left + coreRect.width / 2 - visualRect.left;
        const startY = coreRect.top + coreRect.height / 2 - visualRect.top;
        const endX = serviceRect.left + serviceRect.width / 2 - visualRect.left;
        const endY = serviceRect.top + serviceRect.height / 2 - visualRect.top;
        const packet = this.packets[index % this.packets.length];
        if (!packet) {
            return;
        }
        gsap.killTweensOf(packet);
        gsap.set(packet, {
            x: startX,
            y: startY,
            opacity: 0,
            scale: 0.8
        });
        gsap.to(packet, {
            x: endX,
            y: endY,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(packet, {
                    opacity: 0,
                    scale: 1.3,
                    duration: 0.2
                });
            }
        });
    }

    /*
    ==========================================================
    RETURN
    ==========================================================
    */
    animateReturn() {
        if (!this.result || !this.business) {
            return;
        }
        const resultRect = this.result.getBoundingClientRect();
        const businessRect = this.business.getBoundingClientRect();
        const visualRect = this.visual.getBoundingClientRect();
        const startX = resultRect.left + resultRect.width / 2 - visualRect.left;
        const startY = resultRect.top + resultRect.height / 2 - visualRect.top;
        const endX = businessRect.left + businessRect.width / 2 - visualRect.left;
        const endY = businessRect.top + businessRect.height / 2 - visualRect.top;
        const packet = this.packets[0];
        if (!packet) {
            return;
        }
        gsap.set(packet, {
            x: startX,
            y: startY,
            opacity: 0,
            scale: 1
        });
        gsap.to(packet, {
            x: endX,
            y: endY,
            opacity: 1,
            duration: 0.9,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(packet, {
                    opacity: 0,
                    duration: 0.2
                });
            }
        });
    }

    /*
    ==========================================================
    BUSINESS
    ==========================================================
    */
    activateBusiness() {
        if (!this.business) {
            return;
        }
        gsap.to(this.business, {
            opacity: 1,
            scale: 1.03,
            duration: 0.25,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
        });
    }

    /*
    ==========================================================
    CORE
    ==========================================================
    */
    activateCore() {
        if (!this.core) {
            return;
        }
        gsap.killTweensOf(this.core);
        gsap.to(this.core, {
            scale: 1.08,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
    }

    /*
    ==========================================================
    SERVICE
    ==========================================================
    */
    activateService(service) {
        if (!service) {
            return;
        }
        this.services.forEach(item => {
            gsap.to(item, {
                opacity: item === service ? 1 : 0.3,
                y: item === service ? -4 : 0,
                duration: 0.25,
                ease: "power2.out",
                overwrite: true
            });
        });
    }
    deactivateService() {
        if (!this.services.length) {
            return;
        }
        this.services.forEach(item => {
            gsap.to(item, {
                opacity: 0.3,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                overwrite: true
            });
        });
    }

    /*
    ==========================================================
    RESULT
    ==========================================================
    */
    activateResult() {
        if (!this.result) {
            return;
        }
        gsap.to(this.result, {
            opacity: 1,
            scale: 1.1,
            duration: 0.5,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });

        this.deactivateService()
    }

    /*
    ==========================================================
    INTERACTION
    ==========================================================
    */
    enableInteraction() {
        if (this.interactive || !this.visual) {
            return;
        }
        this.interactive = true;
        this.visual.addEventListener("mousemove", this.handleMouseMove);
        this.visual.addEventListener("mouseleave", this.handleMouseLeave);
    }

    /*
    ==========================================================
    MOUSE MOVE
    ==========================================================
    */
    handleMouseMove(event) {
        if (!this.started || !this.core) {
            return;
        }
        const rect = this.visual.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = ((x - centerX) / centerX) * 5;
        const moveY = ((y - centerY) / centerY) * 5;
        gsap.to(this.core, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true
        });
    }

    /*
    ==========================================================
    MOUSE LEAVE
    ==========================================================
    */
    handleMouseLeave() {
        if (!this.core) {
            return;
        }
        gsap.to(this.core, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
        });
    }

    /*
    ==========================================================
    STOP PROCESS
    ==========================================================
    */
    stopProcess() {
        if (this.processTimeline) {
            this.processTimeline.kill();
            this.processTimeline = null;
        }
        if (this.packets) {
            gsap.killTweensOf(this.packets);
            gsap.set(this.packets, {
                opacity: 0
            });
        }
    }

    /*
    ==========================================================
    RESET
    ==========================================================
    */
    reset() {
        this.stopProcess();
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        if (this.business) {
            gsap.set(this.business, {
                opacity: 0,
                y: 20,
                scale: 1
            });
        }
        if (this.core) {
            gsap.set(this.core, {
                opacity: 0,
                scale: 0.94,
                x: 0,
                y: 15
            });
        }
        if (this.services.length) {
            gsap.set(this.services, {
                opacity: 0,
                y: 10
            });
        }
        if (this.result) {
            gsap.set(this.result, {
                opacity: 0,
                y: 10
            });
        }
    }

    /*
    ==========================================================
    STOP
    ==========================================================
    */
    stop() {
        if (!this.started) {
            return;
        }
        console.log("[AboutIntro] stop");
        this.started = false;
        this.stopProcess();
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        if (this.interactive) {
            this.visual.removeEventListener("mousemove", this.handleMouseMove);
            this.visual.removeEventListener("mouseleave", this.handleMouseLeave);
            this.interactive = false;
        }
    }

    /*
    ==========================================================
    DESTROY
    ==========================================================
    */
    destroy() {
        this.stop();
        if (this.particleContainer) {
            this.particleContainer.querySelectorAll(".about-intro-packet").forEach(packet => packet.remove());
        }
        this.packets = [];
        console.log("[AboutIntro] destroyed");
    }
}
