export class PhysicsContainerController {
  constructor(controllerName, container) {
    this.container = container
    this.items = Array.from(this.container.querySelectorAll('.stack-item'))

    if (!this.items.length) {
      throw new Error(`Don't have items in ${controllerName}`);
    }

    this.items.forEach((item) => item.classList.add('physics-activity'))

    this.started = false; // флаг, чтобы запустить физику только один раз

    window.addEventListener('load', this.init)

  }
  startPhysics = () => {
    this.container.style.position = 'relative';

    const { Engine, Runner, World, Bodies, Mouse, MouseConstraint, Events } = Matter;

    const engine = Engine.create();
    engine.gravity.y = 1;

    // ждём один кадр, чтобы layout точно посчитался
    requestAnimationFrame(() => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      const walls = [
        Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true }),
        Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true }),
        Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true }),
        Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true })
      ];
      World.add(engine.world, walls);

      const positions = this.getPyramidPositions(width, height);

      const bodies = this.items.map((el, i) => {
        const w = el.offsetWidth || 140;
        const h = el.offsetHeight || 100;

        const x = Math.random() * (width - w) + w / 2;
        const y = -h - i * 60;

        const body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.4,
          friction: 2,
          frictionAir: 0.05,
          angle: 0
        });

        body.elWidth = w;
        body.elHeight = h;
        body.el = el;
        return body;
      });

      World.add(engine.world, bodies);

      // больше итераций решателя = устойчивее стек
      engine.positionIterations = 10;
      engine.velocityIterations = 10;

      const mouse = Mouse.create(this.container);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
      });
      World.add(engine.world, mouseConstraint);
      mouse.element.removeEventListener('wheel', mouse.mousewheel);

      // держим Mouse синхронизированным с движком при ресайзе/скролле
      Events.on(engine, 'beforeUpdate', () => {
        Mouse.setOffset(mouse, { x: this.container.getBoundingClientRect().left, y: this.container.getBoundingClientRect().top });
      });

      const runner = Runner.create();
      Runner.run(runner, engine);
      // явный цикл синхронизации, не зависящий от событий движка
      (function syncLoop() {
        bodies.forEach(body => {
          const { x, y } = body.position;
          body.el.style.transform =
            `translate(${x - body.elWidth / 2}px, ${y - body.elHeight / 2}px) rotate(${body.angle}rad)`;
        });
        requestAnimationFrame(syncLoop);
      })();
    });
  }
  init = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.started) {
          this.started = true;
          this.startPhysics();
          observer.disconnect(); // больше не нужен
        }
      });
    }, {
      threshold: 0.3 // запускаем, когда видно хотя бы 30% блока
    });

    observer.observe(this.container);
  }
  getPyramidPositions = (containerWidth, containerHeight) => {
    const cols = Math.ceil(Math.sqrt(this.items.length * 2)); // подбираем ширину основания
    const positions = [];
    let idx = 0;
    let row = 0;

    while (idx < this.items.length) {
      const itemsInRow = cols - row;       // каждый верхний ряд короче
      if (itemsInRow <= 0) { row = 0; continue; } // на случай переполнения — начинаем новый "слой"

      for (let col = 0; col < itemsInRow && idx < this.items.length; col++) {
        const w = this.items[idx].offsetWidth || 140;
        const h = this.items[idx].offsetHeight || 100;

        const rowWidth = itemsInRow * w;
        const startX = (containerWidth - rowWidth) / 2;

        const x = startX + col * w + w / 2;
        const y = containerHeight - h / 2 - row * h; // снизу вверх

        positions.push({ x, y: y - 300 }); // -300 чтобы упали сверху и легли красиво
        idx++;
      }
      row++;
    }
    return positions;
  }
}