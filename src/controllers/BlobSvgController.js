export class BlobSvgController {
  constructor(controllerName, container) {

    this.controllerName = controllerName;
    this.container = container;

    this.ns = "http://www.w3.org/2000/svg";

    this.width = 1000;
    this.height = 1000;

    this.center = {
      x: this.width / 2,
      y: this.height / 2
    };

    this.radius = 230;

    this.pointCount = 96;

    this.spring = 0.08;
    this.damping = 0.84;

    this.mouse = {
      x: this.center.x,
      y: this.center.y,
      inside: false
    };

    this.points = [];

    this.svg = null;
    this.path = null;
    this.gradient = null;

    this.animationFrame = null;

    this.idleTime = 0;
    this.isIdle = true;

    this.noiseStrength = 18;
    this.noiseSpeed = 0.002;
    this.time = 0;

    // ===== PRESS STATE =====
    this.isPressed = false;
    this.pressX = 0;
    this.pressY = 0;
    this.pressTime = 0;

    // 0..1, насколько "вжата/раздута" фигура сейчас
    this.pressStrength = 0;
    this.waveTime = 0;

    this.pressureDecay = 0.92;
    this.pressureSpread = 0.18;
    this.pressureStrength = 28;
    this.viscosity = 0.88;

    // насколько сильно при клике точки разлетаются наружу (growth-эффект)
    this.expandStrength = 70;
    // скорость затухания этого "раздутия"
    this.expandDecay = 0.9;
    this.expandAmount = 0; // текущее значение раздутия (0..expandStrength)

    this.ripples = []; // активные волны цвета (SVG circle)

    // ===== ФОНОВЫЙ МОРФИНГ ФОРМЫ (круг <-> овал <-> "квадрат" + дрейф позиции) =====
    this.shapeTime = 0;
    this.shapeSpeed = 0.0026;

    // ===== 3D-СВЕТ (specular highlight едет за курсором) =====
    this.light = null; // ссылка на fePointLight
    this.lightX = this.center.x - 120;
    this.lightY = this.center.y - 160;

    this.init();
  }

  init() {

    this.container.style.position = "absolute";
    this.container.style.overflow = "hidden";

    this.svg = document.createElementNS(this.ns, "svg");

    this.svg.setAttribute("viewBox", "0 0 1000 1000");
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
    this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const defs = document.createElementNS(this.ns, "defs");

    const gradient = document.createElementNS(this.ns, "radialGradient");

    gradient.id = `${this.controllerName}-gradient`;

    gradient.setAttribute("cx", "50%");
    gradient.setAttribute("cy", "50%");
    gradient.setAttribute("r", "45%");

    const stop1 = document.createElementNS(this.ns, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#6c5ce7");
    stop1.setAttribute("class", "blob-stop-1");

    const stop2 = document.createElementNS(this.ns, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#ff2e2e");
    stop2.setAttribute("class", "blob-stop-2");

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);

    defs.appendChild(gradient);

    const filter = document.createElementNS(this.ns, "filter");

    filter.id = `${this.controllerName}-blur`;

    filter.setAttribute("x", "-40%");
    filter.setAttribute("y", "-40%");
    filter.setAttribute("width", "180%");
    filter.setAttribute("height", "180%");

    // 1. мягкое смягчение силуэта (как раньше — лёгкий blur самой формы)
    const softBlur = document.createElementNS(this.ns, "feGaussianBlur");
    softBlur.setAttribute("in", "SourceGraphic");
    softBlur.setAttribute("stdDeviation", "3");
    softBlur.setAttribute("result", "soft");
    filter.appendChild(softBlur);

    // 2. мягкая тень под фигурой (создаёт ощущение, что она приподнята над поверхностью)
    const dropShadow = document.createElementNS(this.ns, "feDropShadow");
    dropShadow.setAttribute("in", "soft");
    dropShadow.setAttribute("dx", "0");
    dropShadow.setAttribute("dy", "22");
    dropShadow.setAttribute("stdDeviation", "26");
    dropShadow.setAttribute("flood-color", "#000000");
    dropShadow.setAttribute("flood-opacity", "0.35");
    dropShadow.setAttribute("result", "shadowed");
    filter.appendChild(dropShadow);

    // 3. рельеф поверхности из альфа-канала (имитация выпуклости сферы)
    const bumpBlur = document.createElementNS(this.ns, "feGaussianBlur");
    bumpBlur.setAttribute("in", "SourceAlpha");
    bumpBlur.setAttribute("stdDeviation", "16");
    bumpBlur.setAttribute("result", "bump");
    filter.appendChild(bumpBlur);

    // 4. specular-свет от точечного источника — даёт глянцевый 3D-блик
    const specLighting = document.createElementNS(this.ns, "feSpecularLighting");
    specLighting.setAttribute("in", "bump");
    specLighting.setAttribute("surfaceScale", "10");
    specLighting.setAttribute("specularConstant", "0.85");
    specLighting.setAttribute("specularExponent", "16");
    specLighting.setAttribute("lighting-color", "#ffffff");
    specLighting.setAttribute("result", "spec");

    const pointLight = document.createElementNS(this.ns, "fePointLight");
    pointLight.setAttribute("x", String(this.lightX));
    pointLight.setAttribute("y", String(this.lightY));
    pointLight.setAttribute("z", "260");

    specLighting.appendChild(pointLight);
    filter.appendChild(specLighting);

    this.light = pointLight;

    // 5. обрезаем блик по силуэту фигуры (чтобы свет не вылезал за форму)
    const specClip = document.createElementNS(this.ns, "feComposite");
    specClip.setAttribute("in", "spec");
    specClip.setAttribute("in2", "SourceAlpha");
    specClip.setAttribute("operator", "in");
    specClip.setAttribute("result", "specClipped");
    filter.appendChild(specClip);

    // 6. собираем итог: тень + цвет + блик сверху
    const merge = document.createElementNS(this.ns, "feMerge");

    const mergeShadow = document.createElementNS(this.ns, "feMergeNode");
    mergeShadow.setAttribute("in", "shadowed");

    const mergeSpec = document.createElementNS(this.ns, "feMergeNode");
    mergeSpec.setAttribute("in", "specClipped");

    merge.appendChild(mergeShadow);
    merge.appendChild(mergeSpec);
    filter.appendChild(merge);

    defs.appendChild(filter);

    this.svg.appendChild(defs);

    // группа для волн (рисуются под основным path)
    this.rippleGroup = document.createElementNS(this.ns, "g");
    this.svg.appendChild(this.rippleGroup);

    this.path = document.createElementNS(this.ns, "path");

    this.path.setAttribute(
      "fill",
      `url(#${this.controllerName}-gradient)`
    );

    this.path.setAttribute(
      "filter",
      `url(#${this.controllerName}-blur)`
    );

    this.svg.appendChild(this.path);

    this.container.appendChild(this.svg);

    this.gradient = gradient;

    this.createPoints();
    this.bindEvents();
    this.animate();

  }

  createPoints() {

    this.points.length = 0;

    const step = (Math.PI * 2) / this.pointCount;

    for (let i = 0; i < this.pointCount; i++) {

      const angle = step * i;

      const nx = Math.cos(angle);
      const ny = Math.sin(angle);

      const x = this.center.x + nx * this.radius;
      const y = this.center.y + ny * this.radius;

      this.points.push({

        id: i,

        angle,
        nx,
        ny,

        originX: x,
        originY: y,

        x,
        y,

        vx: 0,
        vy: 0,

        pressure: 0,
        pressureVelocity: 0,

        memoryX: x,
        memoryY: y,

        force: 0
      });
    }
  }

  buildPath() {

    if (this.points.length < 4) return;

    const pts = this.points;
    const tension = 0.22;

    let d = "";

    const count = pts.length;

    for (let i = 0; i < count; i++) {

      const p0 = pts[(i - 1 + count) % count];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % count];
      const p3 = pts[(i + 2) % count];

      if (i === 0) {
        d += `M ${p1.x} ${p1.y} `;
      }

      const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
      const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;

      const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
      const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

      d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;

    }

    d += "Z";

    this.path.setAttribute("d", d);

  }

  updatePhysics() {

    this.time = (this.time || 0) + this.noiseSpeed;
    this.shapeTime += this.shapeSpeed;

    const mouse = this.mouse;
    const idle = !mouse.inside;

    // === ФОНОВЫЙ МОРФИНГ ФОРМЫ ===
    // Эти коэффициенты медленно "дышат" между 0 и 1, заставляя форму
    // то вытягиваться в овал, то сжиматься в стороны как квадрат —
    // независимо от того, идёт ли взаимодействие с курсором.
    const t = this.shapeTime;

    const ovalFactor = (Math.sin(t * 1.0) + 1) / 2;             // 0..1
    const squareFactor = (Math.sin(t * 0.7 + Math.PI / 2.3) + 1) / 2; // 0..1, смещён по фазе

    // лёгкий дрейф центра формы (т.е. вся фигура чуть "гуляет" по контейнеру)
    const driftX = Math.sin(t * 0.45) * 26;
    const driftY = Math.cos(t * 0.33) * 20;

    // затухание "раздутия" при нажатии
    if (this.expandAmount > 0.01) {
      this.expandAmount *= this.expandDecay;
    } else {
      this.expandAmount = 0;
    }

    for (let i = 0; i < this.points.length; i++) {

      const p = this.points[i];

      // BASE REST SHAPE
      let tx = p.originX;
      let ty = p.originY;

      // ФОРМА: овал — растягивает по горизонтальной оси (cos(angle)^2 даёт пик на 0/180°)
      const ovalWave = Math.cos(p.angle) * Math.cos(p.angle) * 38 * ovalFactor;

      // ФОРМА: "квадрат" — 4 симметричные выпуклости/вмятины по углам (cos(4*angle))
      const squareWave = Math.cos(p.angle * 4) * 30 * squareFactor;

      tx += p.nx * (ovalWave + squareWave) + driftX;
      ty += p.ny * (ovalWave + squareWave) + driftY;

      // CURSOR FIELD
      if (mouse.inside) {

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;

        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 180;

        if (dist < radius) {

          const f = (1 - dist / radius);
          const ang = Math.atan2(dy, dx);

          tx += Math.cos(ang) * f * 120;
          ty += Math.sin(ang) * f * 120;
        }
      }

      // PRESSURE FIELD (волны деформации поверхности)
      tx += p.nx * p.pressure;
      ty += p.ny * p.pressure;

      // PRESS-EXPAND (раздутие наружу при нажатии — "сфера растягивается")
      if (this.expandAmount > 0) {
        tx += p.nx * this.expandAmount;
        ty += p.ny * this.expandAmount;
      }

      // IDLE NOISE
      if (idle) {

        const n =
          Math.sin(this.time + p.angle * 2.0) * this.noiseStrength +
          Math.cos(this.time * 0.6 + p.angle * 3.0) * (this.noiseStrength * 0.5);

        tx += p.nx * n;
        ty += p.ny * n;
      }

      // SPRING INTEGRATION
      const ax = (tx - p.x) * this.spring;
      const ay = (ty - p.y) * this.spring;

      p.vx += ax;
      p.vy += ay;

      p.vx *= this.damping;
      p.vy *= this.damping;

      p.x += p.vx;
      p.y += p.vy;

      // PRESSURE DIFFUSION
      const prev = this.points[(i - 1 + this.points.length) % this.points.length];
      const next = this.points[(i + 1) % this.points.length];

      const diffusion =
        (prev.pressure + next.pressure - 2 * p.pressure) * this.pressureSpread;

      p.pressureVelocity += diffusion;

      p.pressureVelocity *= this.pressureDecay;
      p.pressure += p.pressureVelocity;

      p.pressure *= this.viscosity;

      if (p.pressure > 80) p.pressure = 80;
      if (p.pressure < -80) p.pressure = -80;
    }
  }

  bindEvents() {

    const rect = () => this.svg.getBoundingClientRect();

    const toSVG = (clientX, clientY) => {

      const r = rect();

      const x = ((clientX - r.left) / r.width) * this.width;
      const y = ((clientY - r.top) / r.height) * this.height;

      return { x, y };
    };

    this.container.addEventListener("mousemove", (e) => {
      const pos = toSVG(e.clientX, e.clientY);

      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.inside = true;
    });

    this.container.addEventListener("mouseleave", () => {
      this.mouse.inside = false;
      this.idleTime = 0;
    });

    this.container.addEventListener("mouseenter", () => {
      this.mouse.inside = true;
    });

    // ИСПРАВЛЕНО: координаты клика теперь реально берутся из события
    this.container.addEventListener("mousedown", (e) => {
      const pos = toSVG(e.clientX, e.clientY);

      this.pressX = pos.x;
      this.pressY = pos.y;
      this.pressTime = performance.now();

      this.isPressed = true;
      this.pressStrength = 1;
      this.expandAmount = this.expandStrength;

      this.applyPressure(this.pressX, this.pressY);
      this.spawnRipple(this.pressX, this.pressY);
    });

    window.addEventListener("mouseup", () => {
      this.isPressed = false;
    });

    // тач-поддержка
    this.container.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      if (!t) return;
      const pos = toSVG(t.clientX, t.clientY);

      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
      this.mouse.inside = true;

      this.pressX = pos.x;
      this.pressY = pos.y;
      this.pressTime = performance.now();

      this.isPressed = true;
      this.pressStrength = 1;
      this.expandAmount = this.expandStrength;

      this.applyPressure(this.pressX, this.pressY);
      this.spawnRipple(this.pressX, this.pressY);
      this.emitSceneWave(pos);
    }, { passive: true });

    window.addEventListener("touchend", () => {
      this.isPressed = false;
      this.mouse.inside = false;
    });
  }

  animate() {

    const loop = () => {
      this.waveTime += 0.06;

      this.updatePhysics();
      this.buildPath();
      this.updateGradient();
      this.updateLight();
      this.updateSceneWave();
      this.updateRipples();

      this.animationFrame = requestAnimationFrame(loop);
    };

    loop();
  }

  // плавный "пульс" масштаба самого контейнера при нажатии
  updateSceneWave() {

    if (this.pressStrength <= 0.001) {
      this.pressStrength = 0;
      return;
    }

    const t = this.waveTime;

    // лёгкое пружинное затухание силы нажатия
    this.pressStrength *= 0.94;

    const scale = 1 + Math.sin(t * 6) * 0.015 * this.pressStrength;

    this.container.style.transform = `scale(${scale})`;
  }

  // плавно двигает источник specular-света к курсору (3D-блик "следит" за мышью)
  updateLight() {

    if (!this.light) return;

    const targetX = this.mouse.inside ? this.mouse.x : this.center.x - 120;
    const targetY = this.mouse.inside ? this.mouse.y : this.center.y - 160;

    this.lightX += (targetX - this.lightX) * 0.06;
    this.lightY += (targetY - this.lightY) * 0.06;

    this.light.setAttribute("x", String(this.lightX));
    this.light.setAttribute("y", String(this.lightY));
  }

  updateGradient() {

    const mouse = this.mouse;

    const cx = (mouse.x / this.width) * 100;
    const cy = (mouse.y / this.height) * 100;

    this.gradient.setAttribute("cx", `${cx}%`);
    this.gradient.setAttribute("cy", `${cy}%`);
  }

  applyPressure(x, y) {

    for (let i = 0; i < this.points.length; i++) {

      const p = this.points[i];

      const dx = p.x - x;
      const dy = p.y - y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      const radius = 240;

      if (dist < radius) {

        const force = (1 - dist / radius);

        p.pressure += force * this.pressureStrength;
      }
    }
  }

  // === Волна цвета НА фигуре (расходится из точки клика по SVG) ===
  spawnRipple(x, y) {

    const circle = document.createElementNS(this.ns, "circle");

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "1");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "6");
    circle.setAttribute("opacity", "0.55");

    this.rippleGroup.appendChild(circle);

    this.ripples.push({
      el: circle,
      r: 1,
      maxR: 420,
      opacity: 0.55,
      speed: 9
    });
  }

  updateRipples() {

    for (let i = this.ripples.length - 1; i >= 0; i--) {

      const ripple = this.ripples[i];

      ripple.r += ripple.speed;
      ripple.opacity *= 0.94;

      ripple.el.setAttribute("r", ripple.r);
      ripple.el.setAttribute("opacity", ripple.opacity.toFixed(3));
      ripple.el.setAttribute("stroke-width", Math.max(1, 6 * ripple.opacity / 0.55));

      if (ripple.r > ripple.maxR || ripple.opacity < 0.02) {
        ripple.el.remove();
        this.ripples.splice(i, 1);
      }
    }
  }

  // === Сигнал наружу: запускаем волну ПОД элементом через .scene::before ===
  emitSceneWave(pos) {

    const scene = this.container.closest(".about") || this.container.closest(".scene") || this.container.parentElement;
    if (!scene) return;

    // координаты клика в процентах относительно контейнера — пригодится для
    // позиционирования градиента/волны в CSS, если нужно (--wave-x/--wave-y)
    scene.style.setProperty("--wave-x", `${(pos.x / this.width) * 100}%`);
    scene.style.setProperty("--wave-y", `${(pos.y / this.height) * 100}%`);

    // перезапускаем CSS-анимацию волны: убираем класс, форсируем reflow, ставим заново
    scene.classList.remove("wave-active");
    // forced reflow, чтобы анимация рестартовала даже если класс уже был
    void scene.offsetWidth;
    scene.classList.add("wave-active");
  }

  destroy() {

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }

    this.svg = null;
    this.path = null;
    this.gradient = null;
    this.points = [];
    this.ripples = [];

    this.mouse = {
      x: 0,
      y: 0,
      inside: false
    };
  }
}