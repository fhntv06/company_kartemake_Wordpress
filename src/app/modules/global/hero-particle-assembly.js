/*
==========================================================
K·ART·MAKE V5.2
HERO PARTICLE ASSEMBLY
==========================================================

DIGITAL PARTICLE MORPH SYSTEM

PIPELINE:

    PLANET
      ↓
    MORPH 2s
      ↓
    COMPUTER
      ↓
    MORPH 2s
      ↓
    SERVER
      ↓
    MORPH 2s
      ↓
    GEAR
      ↓
    MORPH 2s
      ↓
    PLANET

FIGURE HOLD:
    5 sec

MORPH:
    2 sec

ARCHITECTURE:

SceneManager
      ↓
sceneActivated
      ↓
HeroParticleAssembly.start()

SceneManager
      ↓
sceneDeactivated
      ↓
HeroParticleAssembly.stop()

IMPORTANT:

This module owns only the Hero
particle visualization.

It does NOT control:

- SceneManager
- TransitionLoader
- OrbitNavigation
- ScrollTrigger
- page scrolling
==========================================================
*/
export default class HeroParticleAssembly {
  constructor() {
    console.log("[HeroParticleAssembly] ready")
    /*
    ======================================================
    DOM
    ======================================================
    */
    this.scene = document.querySelector(".scene-hero");
    if (!this.scene) {
      console.warn("[HeroParticleAssembly] Hero scene not found");
      return;
    }
    /*
    ======================================================
    CANVAS
    ======================================================
    */
    this.canvas = document.getElementById("hero-particle-canvas");
    if (!this.canvas) {
      console.warn("[HeroParticleAssembly] Hero hero-particle-canvas not found");
      return;
    }
    this.ctx = this.canvas.getContext("2d");
    /*
    ======================================================
    SIZE
    ======================================================
    */
    this.width = this.scene.clientWidth || window.innerWidth;
    this.height = this.scene.clientHeight || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    /*
    ======================================================
    STATE
    ======================================================
    */
    this.running = false;
    this.initialized = false;
    this.animationFrame = null;
    this.resizeHandler = null;
    this.sceneActivatedHandler = null;
    this.sceneDeactivatedHandler = null;

    /*
    Current figure
    */
    this.currentShapeIndex = 0;
    /*
    Next figure
    */
    this.nextShapeIndex = 1;
    /*
    Animation phase
    */
    this.phase = "idle";
    /*
    Time when current phase started
    */
    this.phaseStartedAt = 0;
    /*
    ======================================================
    MOUSE
    ======================================================
    */
    this.mouse = {
      x: 0,
      y: 0,

      previousX: 0,
      previousY: 0,

      velocityX: 0,
      velocityY: 0,

      active: false
    };
    this.mouseMoveHandler = null;
    this.mouseLeaveHandler = null;
    /*
    ======================================================
    CONFIG
    ======================================================
    */
    this.config = {
      /*
      ----------------------------------------------------
      PARTICLES
      ----------------------------------------------------
      */
      particleCount: 600,
      minSize: 1.0,
      maxSize: 2.2,
      minAlpha: 0.35,
      maxAlpha: 0.9,
      /*
      ----------------------------------------------------
      TIMING
      ----------------------------------------------------
      */
      holdDuration: 5000,
      morphDuration: 2000,
      /*
      ----------------------------------------------------
      MORPH
      ----------------------------------------------------
      */
      morphEase: "power2.inOut",
      /*
      ----------------------------------------------------
      CONNECTIONS
      ----------------------------------------------------
      */
      connectionDistance: 72,
      maxConnections: 3,
      connectionAlpha: 0.14,
      connectionWidth: 0.6,
      /*
      ----------------------------------------------------
      MOUSE INTERACTION
      ----------------------------------------------------
      */
      mouseRadius: 150,
      mouseStrength: 24,
      mouseVelocityInfluence: 0.65,
      mouseReturnSpeed: 0.075,
      mouseDamping: 0.82,
      mouseMaxVelocity: 8,
      /*
      ----------------------------------------------------
      VISUAL
      ----------------------------------------------------
      */
      particleColor: "255,107,0",
      /*
      ----------------------------------------------------
      FIGURE SCALE
      ----------------------------------------------------
      */
      figureScale: 0.28,
      /*
      ----------------------------------------------------
      GLOBE
      ----------------------------------------------------
      */
      globeLatitudeLines: 7,
      globeLongitudeLines: 10,
      /*
      ----------------------------------------------------
      COMPUTER
      ----------------------------------------------------
      */
      computerWidth: 0.58,
      computerHeight: 0.40,
      /*
      ----------------------------------------------------
      SERVER
      ----------------------------------------------------
      */
      serverWidth: 0.48,
      serverHeight: 0.62,
      /*
      ----------------------------------------------------
      GEAR
      ----------------------------------------------------
      */
      gearTeeth: 12,
      gearInnerRadius: 0.22,
      gearOuterRadius: 0.34
    };
    /*
    ======================================================
    PARTICLES
    ======================================================
    */
    this.particles = [];
    /*
    ======================================================
    SHAPES
    ======================================================
    */
    this.shapes = [];
    /*
    ======================================================
    INIT
    ======================================================
    */
    this.init();
  }

  /*
  ========================================================
  INIT
  ========================================================
  */
  init() {
    if (this.initialized) {
      return;
    }
    this.resize();
    this.createParticles();
    this.generateShapes();
    this.applyInitialShape();
    this.bindEvents();
    this.initialized = true;
    console.log("[HeroParticleAssembly] initialized");
  }

  /*
  ========================================================
  RESIZE
  ========================================================
  */
  resize() {
    this.width = this.scene.clientWidth || window.innerWidth;
    this.height = this.scene.clientHeight || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    /*
    ------------------------------------------------------
    Regenerate geometry
    ------------------------------------------------------
    */
    if (this.initialized) {
      this.generateShapes();
      this.applyShapePositions(this.currentShapeIndex);
    }
  }

  /*
  ========================================================
  CREATE PARTICLES
  ========================================================
  */
  createParticles() {
    this.particles = [];
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        /*
        --------------------------------------------------
        Position
        --------------------------------------------------
        */
        x: centerX,
        y: centerY,
        currentX: centerX,
        currentY: centerY,
        targetX: centerX,
        targetY: centerY,

        /*
        ----------------------------------------------------
        PHYSICS
        ----------------------------------------------------
        */
        vx: 0,
        vy: 0,
        /*
        --------------------------------------------------
        Visual
        --------------------------------------------------
        */
        size: this.config.minSize + Math.random() * (this.config.maxSize - this.config.minSize),
        alpha: this.config.minAlpha + Math.random() * (this.config.maxAlpha - this.config.minAlpha),
        /*
        --------------------------------------------------
        Individual morph variation
        --------------------------------------------------
        */
        morphDelay: Math.random() * 0.08,
        morphSpeed: 0.85 + Math.random() * 0.3,
        /*
        --------------------------------------------------
        Subtle particle phase
        --------------------------------------------------
        */
        phase: Math.random() * Math.PI * 2,
        seed: Math.random(),

        targetMorphX: this.width / 2,
        targetMorphY: this.height / 2,
      });
    }
  }

  /*
  ========================================================
  GENERATE SHAPES
  ========================================================
  */
  generateShapes() {
    this.shapes = [
      this.generateGlobe(),
      this.generateComputer(),
      this.generateServer(),
      this.generateGear()
    ];
  }

  /*
  ========================================================
  APPLY INITIAL SHAPE
  ========================================================
  */
  applyInitialShape() {
    if (!this.shapes.length) {
      return;
    }
    this.applyShapePositions(this.currentShapeIndex);
  }

  /*
  ========================================================
  APPLY SHAPE POSITIONS
  ========================================================
  */
  applyShapePositions(index) {
    const shape = this.shapes[index];
    if (!shape || !shape.length) {
      return;
    }
    this.particles.forEach((particle, index) => {
      const point = shape[index % shape.length];
      particle.x = point.x;
      particle.y = point.y;
      particle.currentX = point.x;
      particle.currentY = point.y;
      particle.targetX = point.x;
      particle.targetY = point.y;
      particle.targetMorphX = point.x;
      particle.targetMorphY = point.y;
    });
  }

  /*
  ========================================================
  GENERATE GLOBE
  ========================================================
  */
  generateGlobe() {
    const points = [];
    const centerX = this.width * 0.72;
    const centerY = this.height * 0.48;
    const radius = Math.min(this.width, this.height) * this.config.figureScale;
    const count = this.config.particleCount;
    /*
    ------------------------------------------------------
    Sphere surface
    ------------------------------------------------------
    */
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / count);
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;
      const x3d = Math.sin(theta) * Math.cos(phi);
      const y3d = Math.cos(theta);
      const z3d = Math.sin(theta) * Math.sin(phi);
      const depth = 0.82 + z3d * 0.18;
      points.push({
        x: centerX + x3d * radius * depth,
        y: centerY + y3d * radius
      });
    }
    /*
    ------------------------------------------------------
    Latitude / longitude reinforcement
    ------------------------------------------------------
    */
    this.addGlobeLines(points, centerX, centerY, radius);
    return this.normalizePoints(points);
  }

  /*
  ========================================================
  ADD GLOBE LINES
  ========================================================
  */
  addGlobeLines(points, centerX, centerY, radius) {
    /*
    ------------------------------------------------------
    Latitude
    ------------------------------------------------------
    */
    const latitudeCount = this.config.globeLatitudeLines;
    for (let i = 1; i < latitudeCount; i++) {
      const ratio = i / latitudeCount;
      const y = centerY - radius + ratio * radius * 2;
      const normalized = Math.abs((y - centerY) / radius);
      const width = Math.sqrt(Math.max(0, 1 - normalized * normalized)) * radius;
      this.addLinePoints(points, centerX - width, y, centerX + width, y, 10);
    }
    /*
    ------------------------------------------------------
    Longitude
    ------------------------------------------------------
    */
    const longitudeCount = this.config.globeLongitudeLines;
    for (let i = 0; i < longitudeCount; i++) {
      const angle = (i / longitudeCount) * Math.PI;
      const width = Math.sin(angle) * radius;
      this.addLinePoints(points, centerX - width, centerY - radius, centerX + width, centerY + radius, 10);
    }
  }

  /*
  ========================================================
  GENERATE COMPUTER
  ========================================================
  */
  generateComputer() {
    const points = [];
    const centerX = this.width * 0.72;
    const centerY = this.height * 0.48;
    const size = Math.min(this.width, this.height);
    const width = size * this.config.computerWidth;
    const height = size * this.config.computerHeight;
    /*
    ------------------------------------------------------
    Monitor
    ------------------------------------------------------
    */
    this.addRectanglePoints(points, centerX - width / 2, centerY - height / 2, width, height, Math.round(this.config.particleCount * 0.28));
    /*
    ------------------------------------------------------
    Screen grid
    ------------------------------------------------------
    */
    this.addGridPoints(points, centerX - width * 0.40, centerY - height * 0.35, width * 0.80, height * 0.65, Math.round(this.config.particleCount * 0.30));
    /*
    ------------------------------------------------------
    Screen signal
    ------------------------------------------------------
    */
    this.addLinePoints(points, centerX - width * 0.32, centerY, centerX - width * 0.10, centerY - height * 0.12, 20);
    this.addLinePoints(points, centerX - width * 0.10, centerY - height * 0.12, centerX + width * 0.08, centerY + height * 0.10, 20);
    this.addLinePoints(points, centerX + width * 0.08, centerY + height * 0.10, centerX + width * 0.30, centerY - height * 0.16, 20);
    /*
    ------------------------------------------------------
    Stand
    ------------------------------------------------------
    */
    this.addLinePoints(points, centerX, centerY + height / 2, centerX, centerY + height * 0.68, 30);
    /*
    ------------------------------------------------------
    Base
    ------------------------------------------------------
    */
    this.addLinePoints(points, centerX - width * 0.20, centerY + height * 0.68, centerX + width * 0.20, centerY + height * 0.68, 35);
    return this.normalizePoints(points);
  }

  /*
  ========================================================
  GENERATE SERVER
  ========================================================
  */
  generateServer() {
    const points = [];
    const centerX = this.width * 0.72;
    const centerY = this.height * 0.48;
    const size = Math.min(this.width, this.height);
    const width = size * this.config.serverWidth;
    const height = size * this.config.serverHeight;
    /*
    ------------------------------------------------------
    Main chassis
    ------------------------------------------------------
    */
    this.addRectanglePoints(points, centerX - width / 2, centerY - height / 2, width, height, Math.round(this.config.particleCount * 0.30));
    /*
    ------------------------------------------------------
    Rack rows
    ------------------------------------------------------
    */
    const rows = 6;
    for (let row = 0; row < rows; row++) {
      const y = centerY - height * 0.36 + row * (height * 0.72 / (rows - 1));
      this.addLinePoints(points, centerX - width * 0.35, y, centerX + width * 0.35, y, 24);
      /*
      ----------------------------------------------------
      Status indicator
      ----------------------------------------------------
      */
      this.addCirclePoints(points, centerX - width * 0.40, y, Math.min(width, height) * 0.018, 8);
    }
    /*
    ------------------------------------------------------
    Central data spine
    ------------------------------------------------------
    */
    this.addLinePoints(points, centerX, centerY - height * 0.40, centerX, centerY + height * 0.40, 45);
    return this.normalizePoints(points);
  }

  /*
  ========================================================
  GENERATE GEAR
  ========================================================
  */
  generateGear() {
    const points = [];
    const centerX = this.width * 0.72;
    const centerY = this.height * 0.48;
    const size = Math.min(this.width, this.height);
    const innerRadius = size * this.config.gearInnerRadius;
    const outerRadius = size * this.config.gearOuterRadius;
    const teeth = this.config.gearTeeth;
    /*
    ------------------------------------------------------
    Gear perimeter
    ------------------------------------------------------
    */
    const segments = teeth * 4;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const phase = i % 4;
      let radius;
      if (phase === 0 || phase === 3) {
        radius = outerRadius;
      } else {
        radius = innerRadius;
      }
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    }
    /*
    ------------------------------------------------------
    Inner ring
    ------------------------------------------------------
    */
    this.addCirclePoints(points, centerX, centerY, innerRadius * 0.58, Math.round(this.config.particleCount * 0.20));
    /*
    ------------------------------------------------------
    Center
    ------------------------------------------------------
    */
    this.addCirclePoints(points, centerX, centerY, innerRadius * 0.18, Math.round(this.config.particleCount * 0.08));
    return this.normalizePoints(points);
  }

  /*
  ========================================================
  ADD RECTANGLE POINTS
  ========================================================
  */
  addRectanglePoints(points, x, y, width, height, count) {
    const perimeter = 2 * (width + height);
    for (let i = 0; i < count; i++) {
      const distance = (i / Math.max(count - 1, 1)) * perimeter;
      let px, py;
      if (distance < width) {
        px = x + distance;
        py = y;
      } else if (distance < width + height) {
        px = x + width;
        py = y + (distance - width);
      } else if (distance < width * 2 + height) {
        px = x + width - (distance - width - height);
        py = y + height;
      } else {
        px = x;
        py = y + height - (distance - width * 2 - height);
      }
      points.push({ x: px, y: py });
    }
  }

  /*
  ========================================================
  ADD GRID POINTS
  ========================================================
  */
  addGridPoints(points, x, y, width, height, count) {
    const columns = Math.max(2, Math.round(Math.sqrt(count)));
    const rows = Math.max(2, Math.ceil(count / columns));
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (points.length >= count) {
          return;
        }
        const px = x + (column / Math.max(columns - 1, 1)) * width;
        const py = y + (row / Math.max(rows - 1, 1)) * height;
        points.push({ x: px, y: py });
      }
    }
  }

  /*
  ========================================================
  ADD LINE POINTS
  ========================================================
  */
  addLinePoints(points, x1, y1, x2, y2, count) {
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count - 1, 1);
      points.push({
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t
      });
    }
  }

  /*
  ========================================================
  ADD CIRCLE POINTS
  ========================================================
  */
  addCirclePoints(points, centerX, centerY, radius, count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    }
  }

  /*
  ========================================================
  NORMALIZE POINTS
  ========================================================
  */
  normalizePoints(points) {
    if (!points.length) {
      return points;
    }
    const result = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      /*
      ----------------------------------------------
      Не просто копируем подряд.

      Используем распределение по всей
      существующей геометрии.
      ----------------------------------------------
      */
      const index = Math.floor((i / this.config.particleCount) * points.length);
      result.push(points[Math.min(index, points.length - 1)]);
    }
    return result;
  }

  /*
  ========================================================
  BIND EVENTS
  ========================================================
  */
  bindEvents() {
    /*
    ------------------------------------------------------
    Scene activated
    ------------------------------------------------------
    */
    this.sceneActivatedHandler = () => {
      this.start();
    };
    /*
    ------------------------------------------------------
    Scene deactivated
    ------------------------------------------------------
    */
    this.sceneDeactivatedHandler = () => {
      this.stop();
    };
    this.scene.addEventListener("sceneActivated", this.sceneActivatedHandler);
    this.scene.addEventListener("sceneDeactivated", this.sceneDeactivatedHandler);
    this.scene.dispatchEvent(new CustomEvent('sceneActivated', { bubbles: false }))
    /*
    ------------------------------------------------------
    Resize
    ------------------------------------------------------
    */
    this.resizeHandler = () => {
      this.resize();
    };
    window.addEventListener("resize", this.resizeHandler);

    /*
    ------------------------------------------------------
    Mouse move
    ------------------------------------------------------
    */
    this.mouseMoveHandler = (event) => {
      const rect = this.canvas.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      /*
      ----------------------------------------------------
      Mouse velocity
      ----------------------------------------------------
      */

      this.mouse.velocityX = x - this.mouse.x;
      this.mouse.velocityY = y - this.mouse.y;

      /*
      ----------------------------------------------------
      Position
      ----------------------------------------------------
      */

      this.mouse.previousX = this.mouse.x;
      this.mouse.previousY = this.mouse.y;

      this.mouse.x = x;
      this.mouse.y = y;

      this.mouse.active = true;
    };

    this.mouseLeaveHandler = () => {
      this.mouse.active = false;
      this.mouse.velocityX = 0;
      this.mouse.velocityY = 0;
    };

    window.addEventListener("mousemove", this.mouseMoveHandler, { passive: true });
    window.addEventListener("mouseleave", this.mouseLeaveHandler, { passive: true });
  }

  /*
  ========================================================
  START
  ========================================================
  */
  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    /*
    ----------------------------------------------
    Always start from Planet.
    ----------------------------------------------
    */
    this.currentShapeIndex = 0;
    this.nextShapeIndex = 1;
    this.applyShapePositions(0);
    this.phase = "hold";
    this.phaseStartedAt = performance.now();
    this.render();
    this.animationFrame = requestAnimationFrame(this.tick.bind(this));
    console.log("[HeroParticleAssembly] started");
  }

  /*
  ========================================================
  STOP
  ========================================================
  */
  stop() {
    if (!this.running) {
      return;
    }
    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    /*
    ------------------------------------------------------
    Clear canvas
    ------------------------------------------------------
    */
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.phase = "idle";
    console.log("[HeroParticleAssembly] stopped");
  }

  /*
  ========================================================
  TICK
  ========================================================
  */
  tick(now) {
    if (!this.running) {
      return;
    }

    const elapsed = now - this.phaseStartedAt;

    /*
    ======================================================
    HOLD
    ======================================================
    */

    if (this.phase === "hold") {
      if (elapsed >= this.config.holdDuration) {
        this.beginMorph(now);
      }
    }

    /*
    ======================================================
    MORPH
    ======================================================
    */

    else if (this.phase === "morph") {
      const progress =
        Math.min(
          1,
          elapsed / this.config.morphDuration
        );

      const eased =
        this.easeInOut(progress);

      this.updateMorph(eased);

      if (progress >= 1) {
        this.finishMorph(now);
      }
    }

    /*
    ======================================================
    MOUSE PHYSICS
    ======================================================
    */

    this.updateMousePhysics();

    /*
    ======================================================
    RENDER
    ======================================================
    */

    this.render();

    /*
    ======================================================
    NEXT FRAME
    ======================================================
    */

    this.animationFrame =
      requestAnimationFrame(
        this.tick.bind(this)
      );
  }

  /*
  ========================================================
  BEGIN MORPH
  ========================================================
  */
  beginMorph(now) {
    const nextShape = this.shapes[this.nextShapeIndex];
    if (!nextShape) {
      return;
    }
    this.particles.forEach((particle, index) => {
      particle.currentX = particle.x;
      particle.currentY = particle.y;
      const target = nextShape[index];
      particle.targetX = target.x;
      particle.targetY = target.y;
    });
    this.phase = "morph";
    this.phaseStartedAt = now;
  }

  /*
  ========================================================
  UPDATE MORPH
  ========================================================
  */
  updateMorph(progress) {
    this.particles.forEach((particle) => {
      particle.targetMorphX = particle.currentX + (particle.targetX - particle.currentX) * progress;
      particle.targetMorphY = particle.currentY + (particle.targetY - particle.currentY) * progress;
    });
  }

  /*
  ========================================================
  FINISH MORPH
  ========================================================
  */
  finishMorph(now) {
    this.currentShapeIndex = this.nextShapeIndex;
    this.nextShapeIndex = (this.nextShapeIndex + 1) % this.shapes.length;
    /*
    ------------------------------------------------------
    Exact target
    ------------------------------------------------------
    */
    this.particles.forEach(particle => {
      particle.x = particle.targetX;
      particle.y = particle.targetY;
      particle.currentX = particle.targetX;
      particle.currentY = particle.targetY;
    });
    this.phase = "hold";
    this.phaseStartedAt = now;
  }

  /*
  ========================================================
  EASING
  ========================================================
  */
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /*
  ========================================================
  RENDER
  ========================================================
  */
  render() {
    if (!this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    /*
    ======================================================
    CONNECTIONS
    ======================================================
    */
    this.renderConnections();
    /*
    ======================================================
    PARTICLES
    ======================================================
    */
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.config.particleColor},${particle.alpha})`;
      this.ctx.fill();
    });
  }

  /*
  ========================================================
  RENDER CONNECTIONS
  ========================================================
  */
  renderConnections() {
    const maxDistance = this.config.connectionDistance;
    const maxConnections = this.config.maxConnections;
    const connectionMap = new Array(this.particles.length).fill(0);
    /*
    ------------------------------------------------------
    During morph we can reduce connections.

    This keeps the transition cleaner
    and reduces CPU load.
    ------------------------------------------------------
    */
    const connectionMultiplier = this.phase === "morph" ? 0.65 : 1;
    for (let i = 0; i < this.particles.length; i++) {
      if (connectionMap[i] >= maxConnections) {
        continue;
      }
      const particleA = this.particles[i];
      const neighbours = [];
      for (let j = i + 1; j < this.particles.length; j++) {
        if (connectionMap[j] >= maxConnections) {
          continue;
        }
        const particleB = this.particles[j];
        const dx = particleB.x - particleA.x;
        const dy = particleB.y - particleA.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared <= maxDistance * maxDistance) {
          neighbours.push({
            index: j,
            distance: Math.sqrt(distanceSquared)
          });
        }
      }
      /*
      ----------------------------------------------------
      Nearest first
      ----------------------------------------------------
      */
      neighbours.sort((a, b) => a.distance - b.distance);
      let created = 0;
      for (const neighbour of neighbours) {
        if (created >= Math.floor(maxConnections * connectionMultiplier)) {
          break;
        }
        const j = neighbour.index;
        if (connectionMap[j] >= maxConnections) {
          continue;
        }
        const particleB = this.particles[j];
        const ratio = 1 - neighbour.distance / maxDistance;
        const alpha = ratio * this.config.connectionAlpha;
        this.ctx.beginPath();
        this.ctx.moveTo(particleA.x, particleA.y);
        this.ctx.lineTo(particleB.x, particleB.y);
        this.ctx.strokeStyle = `rgba(${this.config.particleColor},${alpha})`;
        this.ctx.lineWidth = this.config.connectionWidth;
        this.ctx.stroke();
        connectionMap[i]++;
        connectionMap[j]++;
        created++;
      }
    }
  }

  /*
  ========================================================
  REFRESH
  ========================================================
  */
  refresh() {
    this.resize();
  }

  /*
========================================================
UPDATE MOUSE PHYSICS
========================================================

Mouse creates a temporary repulsion field.

Particles receive an impulse and then
smoothly return to their current shape.
========================================================
*/

  updateMousePhysics() {
    const radius = this.config.mouseRadius;
    const strength = this.config.mouseStrength;
    const velocityInfluence = this.config.mouseVelocityInfluence;
    const returnSpeed = this.config.mouseReturnSpeed;
    const damping = this.config.mouseDamping;
    const maxVelocity = this.config.mouseMaxVelocity;

    /*
    ======================================================
    MOUSE VELOCITY
    ======================================================
    */

    let mouseVelocityX = this.mouse.velocityX;
    let mouseVelocityY = this.mouse.velocityY;

    /*
    ------------------------------------------------------
    Limit mouse velocity.
    ------------------------------------------------------
    */

    const mouseVelocityLength = Math.sqrt(mouseVelocityX * mouseVelocityX + mouseVelocityY * mouseVelocityY);

    if (mouseVelocityLength > 25) {
      const factor = 25 / mouseVelocityLength;

      mouseVelocityX *= factor;
      mouseVelocityY *= factor;
    }

    /*
    ======================================================
    PARTICLES
    ======================================================
    */

    this.particles.forEach((particle) => {
      /*
      ----------------------------------------------------
      Distance from mouse
      ----------------------------------------------------
      */

      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;

      const distanceSquared =
        dx * dx +
        dy * dy;

      /*
      ----------------------------------------------------
      Outside influence radius
      ----------------------------------------------------
      */

      if (
        !this.mouse.active ||
        distanceSquared > radius * radius
      ) {
        /*
        --------------------------------------------------
        Return to shape
        --------------------------------------------------
        */

        particle.vx +=
          (particle.targetX - particle.x) *
          returnSpeed;

        particle.vy +=
          (particle.targetY - particle.y) *
          returnSpeed;
      } else {
        /*
        --------------------------------------------------
        Distance
        --------------------------------------------------
        */

        const distance =
          Math.sqrt(distanceSquared);

        /*
        --------------------------------------------------
        Avoid division by zero
        --------------------------------------------------
        */

        if (distance > 0.001) {
          /*
          ------------------------------------------------
          Normalized direction
          ------------------------------------------------
          */

          const nx = dx / distance;
          const ny = dy / distance;

          /*
          ------------------------------------------------
          Falloff

          1.0 = mouse touches particle
          0.0 = edge of radius
          ------------------------------------------------
          */

          const falloff =
            1 - distance / radius;

          /*
          ------------------------------------------------
          Smooth falloff
          ------------------------------------------------
          */

          const force =
            falloff *
            falloff *
            strength;

          /*
          ------------------------------------------------
          Mouse movement adds momentum
          ------------------------------------------------
          */

          const velocityForce =
            mouseVelocityLength *
            velocityInfluence *
            falloff;

          /*
          ------------------------------------------------
          Repulsion
          ------------------------------------------------
          */

          particle.vx +=
            nx * force;

          particle.vy +=
            ny * force;

          /*
          ------------------------------------------------
          Small movement-direction impulse
          ------------------------------------------------
          */

          particle.vx +=
            mouseVelocityX *
            velocityForce *
            0.035;

          particle.vy +=
            mouseVelocityY *
            velocityForce *
            0.035;
        }

        /*
        --------------------------------------------------
        Always pull particle back toward shape
        --------------------------------------------------
        */

        particle.vx +=
          (particle.targetX - particle.x) *
          returnSpeed;

        particle.vy +=
          (particle.targetY - particle.y) *
          returnSpeed;
      }

      /*
      ====================================================
      VELOCITY LIMIT
      ====================================================
      */

      const velocityLength = Math.sqrt(
        particle.vx * particle.vx +
        particle.vy * particle.vy
      );

      if (velocityLength > maxVelocity) {
        const factor =
          maxVelocity / velocityLength;

        particle.vx *= factor;
        particle.vy *= factor;
      }

      /*
      ====================================================
      DAMPING
      ====================================================
      */

      particle.vx *= damping;
      particle.vy *= damping;

      /*
      ====================================================
      POSITION
      ====================================================
      */

      particle.x += particle.vx;
      particle.y += particle.vy;
    });

    /*
    ======================================================
    MOUSE VELOCITY DECAY
    ======================================================
    */

    this.mouse.velocityX *= 0.75;
    this.mouse.velocityY *= 0.75;
  }
  /*
  ========================================================
  DESTROY
  ========================================================
  */
  destroy() {
    this.stop();
    if (this.scene && this.sceneActivatedHandler) {
      this.scene.removeEventListener("sceneActivated", this.sceneActivatedHandler);
    }
    if (this.scene && this.sceneDeactivatedHandler) {
      this.scene.removeEventListener("sceneDeactivated", this.sceneDeactivatedHandler);
    }
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
    if (this.canvas && this.mouseMoveHandler) {
      this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }
    if (this.canvas && this.mouseLeaveHandler) {
      this.canvas.removeEventListener("mouseleave", this.mouseLeaveHandler);
    }
    this.particles = [];
    this.shapes = [];
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
    this.initialized = false;
  }
}