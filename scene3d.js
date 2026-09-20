(function () {
  const wrap = document.getElementById("hero3d");
  const scoreEl = document.getElementById("scoreEl");
  const hpEl = document.getElementById("hpEl");

  if (!wrap || !window.THREE) return;

  /* =========================================================
     HELPERS
  ========================================================= */

  function makeCanvas(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    return c;
  }

  function tex(canvas) {
    const t = new THREE.CanvasTexture(canvas);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    return t;
  }

  const GMAP = (() => {
    const c = makeCanvas(4, 1, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 4, 0);
      g.addColorStop(0, "#000");
      g.addColorStop(0.5, "#999");
      g.addColorStop(1, "#fff");

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 1);
    });

    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    return t;
  })();

  function toon(color) {
    return new THREE.MeshToonMaterial({
      color: color || 0xffffff,
      gradientMap: GMAP
    });
  }

  /* =========================================================
     SCENE
  ========================================================= */

  const scene = new THREE.Scene();

  /*
     SIDE VIEW
     X = kiri / kanan
     Y = atas / bawah
     Z = depth
  */

  const camera = new THREE.PerspectiveCamera(
    48,
    1,
    0.1,
    200
  );

  camera.position.set(0, 3.2, 18);
  camera.lookAt(0, 3.2, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  wrap.appendChild(renderer.domElement);

  /* LIGHT */

  scene.add(
    new THREE.HemisphereLight(
      0xffffff,
      0x6e8fbc,
      1.1
    )
  );

  const sunLight = new THREE.DirectionalLight(
    0xfff4dc,
    1.4
  );

  sunLight.position.set(
    -5,
    10,
    10
  );

  scene.add(sunLight);

  scene.add(
    new THREE.AmbientLight(
      0xffffff,
      0.25
    )
  );

  /* =========================================================
     SKY
  ========================================================= */

  const skyCanvas = makeCanvas(256, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(
      0,
      0,
      0,
      h
    );

    g.addColorStop(0, "#63bdf1");
    g.addColorStop(0.35, "#9edbfa");
    g.addColorStop(0.7, "#d8effc");
    g.addColorStop(1, "#ffffff");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    /* sun */

    ctx.fillStyle = "#ffe27a";
    ctx.beginPath();
    ctx.arc(
      205,
      48,
      25,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "#ffd45c";
    ctx.lineWidth = 4;

    for (let i = 0; i < 12; i++) {
      const a =
        (i / 12) *
        Math.PI *
        2;

      ctx.beginPath();

      ctx.moveTo(
        205 + Math.cos(a) * 34,
        48 + Math.sin(a) * 34
      );

      ctx.lineTo(
        205 + Math.cos(a) * 46,
        48 + Math.sin(a) * 46
      );

      ctx.stroke();
    }
  });

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(
      70,
      20,
      16
    ),
    new THREE.MeshBasicMaterial({
      map: tex(skyCanvas),
      side: THREE.BackSide
    })
  );

  scene.add(sky);

  /* =========================================================
     CLOUDS
  ========================================================= */

  const cloudCanvas = makeCanvas(
    128,
    60,
    (ctx) => {
      ctx.clearRect(
        0,
        0,
        128,
        60
      );

      ctx.fillStyle = "#ffffff";

      ctx.beginPath();

      ctx.arc(25, 38, 15, 0, Math.PI * 2);
      ctx.arc(45, 27, 21, 0, Math.PI * 2);
      ctx.arc(70, 35, 17, 0, Math.PI * 2);
      ctx.arc(92, 39, 13, 0, Math.PI * 2);

      ctx.fill();
    }
  );

  const cloudTexture = tex(cloudCanvas);

  const clouds = [];

  for (let i = 0; i < 8; i++) {
    const cloud = new THREE.Mesh(
      new THREE.PlaneGeometry(
        4.5 + Math.random() * 2,
        1.8 + Math.random()
      ),
      new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
      })
    );

    cloud.position.set(
      -16 + Math.random() * 32,
      5.2 + Math.random() * 3.5,
      -7 - Math.random() * 4
    );

    cloud.userData.speed =
      0.35 + Math.random() * 0.45;

    scene.add(cloud);
    clouds.push(cloud);
  }

  /* =========================================================
     DISTANT MOUNTAINS
  ========================================================= */

  const mountains = new THREE.Group();

  function addMountain(
    x,
    y,
    scale,
    color,
    z
  ) {
    const mountain = new THREE.Mesh(
      new THREE.ConeGeometry(
        3 * scale,
        5 * scale,
        5
      ),
      toon(color)
    );

    mountain.position.set(
      x,
      y,
      z
    );

    mountain.rotation.y =
      Math.PI / 5;

    mountains.add(mountain);
  }

  addMountain(
    -13,
    0.5,
    2.5,
    0x9bc4bd,
    -6
  );

  addMountain(
    -7,
    0.5,
    3,
    0x88b7ae,
    -6
  );

  addMountain(
    0,
    0.5,
    2.3,
    0x9bc4bd,
    -6
  );

  addMountain(
    7,
    0.5,
    3.2,
    0x82afa8,
    -6
  );

  addMountain(
    14,
    0.5,
    2.5,
    0x9bc4bd,
    -6
  );

  scene.add(mountains);

  /* =========================================================
     GROUND
  ========================================================= */

  const grassCanvas = makeCanvas(
    128,
    128,
    (ctx) => {
      ctx.fillStyle = "#72c95d";
      ctx.fillRect(
        0,
        0,
        128,
        128
      );

      for (let i = 0; i < 800; i++) {
        ctx.fillStyle =
          Math.random() > 0.5
            ? "#8ed875"
            : "#61b94e";

        const x =
          Math.random() * 128;

        const y =
          Math.random() * 128;

        ctx.fillRect(
          x,
          y,
          2,
          2
        );
      }
    }
  );

  const grassTexture = tex(
    grassCanvas
  );

  grassTexture.wrapS =
    THREE.RepeatWrapping;

  grassTexture.wrapT =
    THREE.RepeatWrapping;

  grassTexture.repeat.set(
    12,
    4
  );

  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(
      42,
      3,
      12
    ),
    toon(0x63b952)
  );

  ground.position.set(
    0,
    -1.5,
    0
  );

  scene.add(ground);

  const grassTop = new THREE.Mesh(
    new THREE.PlaneGeometry(
      42,
      12
    ),
    new THREE.MeshBasicMaterial({
      map: grassTexture
    })
  );

  grassTop.rotation.x =
    -Math.PI / 2;

  grassTop.position.y =
    0.02;

  scene.add(grassTop);

  /* =========================================================
     FLOWERS / DECORATION
  ========================================================= */

  const decoration = new THREE.Group();

  for (let i = 0; i < 24; i++) {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.025,
        0.025,
        0.35,
        5
      ),
      toon(0x3e9c45)
    );

    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.09,
        6,
        6
      ),
      toon(
        i % 2 === 0
          ? 0xff9acb
          : 0xffe27a
      )
    );

    const x =
      -20 + Math.random() * 40;

    stem.position.set(
      x,
      0.18,
      1 + Math.random() * 2
    );

    flower.position.set(
      x,
      0.4,
      stem.position.z
    );

    decoration.add(
      stem,
      flower
    );
  }

  scene.add(decoration);

  /* =========================================================
     ANIME BIRD
     SIDE VIEW
  ========================================================= */

  const bird = new THREE.Group();

  /* BODY */

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.58,
      12,
      10
    ),
    toon(0xfff1df)
  );

  body.scale.set(
    1.25,
    0.9,
    0.95
  );

  bird.add(body);

  /* BELLY */

  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.43,
      12,
      10
    ),
    toon(0xfffaf2)
  );

  belly.scale.set(
    1.05,
    0.85,
    0.5
  );

  belly.position.set(
    0.12,
    -0.13,
    0.48
  );

  bird.add(belly);

  /* FACE */

  const faceCanvas = makeCanvas(
    256,
    128,
    (ctx) => {
      ctx.clearRect(
        0,
        0,
        256,
        128
      );

      function drawEye(x, y) {
        /* white eye */

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.ellipse(
          x,
          y,
          28,
          34,
          0,
          0,
          Math.PI * 2
        );

        ctx.fill();

        /* iris */

        const g =
          ctx.createLinearGradient(
            0,
            y - 30,
            0,
            y + 30
          );

        g.addColorStop(
          0,
          "#d8a4ff"
        );

        g.addColorStop(
          0.55,
          "#8d45e8"
        );

        g.addColorStop(
          1,
          "#4b197d"
        );

        ctx.fillStyle = g;

        ctx.beginPath();

        ctx.ellipse(
          x,
          y + 5,
          19,
          24,
          0,
          0,
          Math.PI * 2
        );

        ctx.fill();

        /* pupil */

        ctx.fillStyle =
          "#281038";

        ctx.beginPath();

        ctx.ellipse(
          x,
          y + 7,
          9,
          14,
          0,
          0,
          Math.PI * 2
        );

        ctx.fill();

        /* sparkle */

        ctx.fillStyle =
          "#ffffff";

        ctx.beginPath();

        ctx.arc(
          x - 7,
          y - 6,
          7,
          0,
          Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
          x + 7,
          y + 9,
          3,
          0,
          Math.PI * 2
        );

        ctx.fill();

        /* eyebrow */

        ctx.strokeStyle =
          "#542441";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
          x,
          y - 32,
          27,
          Math.PI * 1.1,
          Math.PI * 1.9
        );

        ctx.stroke();
      }

      /*
        Side-facing anime face:
        satu mata besar dominan,
        satu mata lebih kecil di belakang.
      */

      drawEye(
        78,
        61
      );

      drawEye(
        178,
        61
      );

      /* blush */

      ctx.fillStyle =
        "rgba(255,145,190,0.65)";

      ctx.beginPath();

      ctx.ellipse(
        43,
        103,
        20,
        9,
        0,
        0,
        Math.PI * 2
      );

      ctx.ellipse(
        214,
        103,
        20,
        9,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(
      0.92,
      0.48
    ),
    new THREE.MeshBasicMaterial({
      map: tex(faceCanvas),
      transparent: true,
      depthWrite: false
    })
  );

  /*
     Face ditempatkan di sisi depan
     kamera sehingga tetap terlihat.
  */

  face.position.set(
    0.08,
    0.05,
    0.57
  );

  bird.add(face);

  /* BEAK - menghadap kanan */

  const beakTop = new THREE.Mesh(
    new THREE.ConeGeometry(
      0.16,
      0.48,
      4
    ),
    toon(0xffa94d)
  );

  beakTop.rotation.z =
    -Math.PI / 2;

  beakTop.position.set(
    0.76,
    -0.02,
    0.35
  );

  bird.add(beakTop);

  const beakBottom = new THREE.Mesh(
    new THREE.ConeGeometry(
      0.11,
      0.35,
      4
    ),
    toon(0xff8c32)
  );

  beakBottom.rotation.z =
    -Math.PI / 2;

  beakBottom.position.set(
    0.79,
    -0.15,
    0.35
  );

  bird.add(beakBottom);

  /* CREST */

  const crest = new THREE.Group();

  for (let i = 0; i < 3; i++) {
    const feather =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.13,
          0.48,
          5
        ),
        toon(0x7c3aed)
      );

    feather.rotation.z =
      -0.35 + i * 0.35;

    feather.position.set(
      -0.05 + i * 0.12,
      0.62 + Math.abs(i - 1) * 0.03,
      0
    );

    crest.add(feather);
  }

  bird.add(crest);

  /* WINGS */

  const wingGroup =
    new THREE.Group();

  const wingShape =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.38,
        10,
        8
      ),
      toon(0x7c3aed)
    );

  wingShape.scale.set(
    0.45,
    1,
    0.3
  );

  wingShape.position.set(
    -0.1,
    -0.02,
    0.62
  );

  wingGroup.add(
    wingShape
  );

  bird.add(
    wingGroup
  );

  /* SECOND WING */

  const wingBack =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.34,
        10,
        8
      ),
      toon(0x6332c4)
    );

  wingBack.scale.set(
    0.4,
    0.9,
    0.28
  );

  wingBack.position.set(
    -0.2,
    -0.03,
    0.25
  );

  bird.add(
    wingBack
  );

  /* TAIL */

  const tail =
    new THREE.Group();

  for (let i = 0; i < 3; i++) {
    const feather =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.15,
          0.6,
          5
        ),
        toon(0x7c3aed)
      );

    feather.rotation.z =
      Math.PI / 2;

    feather.rotation.y =
      -0.25 + i * 0.25;

    feather.position.set(
      -0.68,
      0.1 + i * 0.13,
      -0.02
    );

    tail.add(
      feather
    );
  }

  bird.add(tail);

  /* FEET */

  const footMat =
    toon(0xffa94d);

  for (let i = 0; i < 2; i++) {
    const foot =
      new THREE.Mesh(
        new THREE.CapsuleGeometry(
          0.05,
          0.2,
          4,
          6
        ),
        footMat
      );

    foot.rotation.z =
      Math.PI / 2;

    foot.position.set(
      -0.18 + i * 0.35,
      -0.62,
      0.15
    );

    bird.add(
      foot
    );
  }

  bird.position.set(
    -3.5,
    3,
    1
  );

  scene.add(
    bird
  );

  /* =========================================================
     PIPES
     SIDE VIEW
  ========================================================= */

  const pipes = [];

  const pipeMat =
    toon(0x42b94c);

  const pipeDarkMat =
    toon(0x2f8f3b);

  const pipeLightMat =
    toon(0x75d86d);

  const PIPE_WIDTH = 1.35;
  const PIPE_DEPTH = 1.5;

  function makePipe(x) {
    const gapCenter =
      2.4 +
      Math.random() * 2.4;

    const gapHalf =
      1.45;

    const group =
      new THREE.Group();

    /*
       Vertical pipe body
    */

    const bodyGeo =
      new THREE.BoxGeometry(
        PIPE_WIDTH,
        8,
        PIPE_DEPTH
      );

    const capGeo =
      new THREE.BoxGeometry(
        1.85,
        0.7,
        1.85
      );

    /* TOP */

    const topBody =
      new THREE.Mesh(
        bodyGeo,
        pipeMat
      );

    topBody.position.y =
      gapCenter +
      gapHalf +
      4;

    group.add(
      topBody
    );

    const topCap =
      new THREE.Mesh(
        capGeo,
        pipeDarkMat
      );

    topCap.position.y =
      gapCenter +
      gapHalf +
      0.35;

    group.add(
      topCap
    );

    /* BOTTOM */

    const bottomBody =
      new THREE.Mesh(
        bodyGeo,
        pipeMat
      );

    bottomBody.position.y =
      gapCenter -
      gapHalf -
      4;

    group.add(
      bottomBody
    );

    const bottomCap =
      new THREE.Mesh(
        capGeo,
        pipeDarkMat
      );

    bottomCap.position.y =
      gapCenter -
      gapHalf -
      0.35;

    group.add(
      bottomCap
    );

    /* HIGHLIGHT */

    const highlightGeo =
      new THREE.BoxGeometry(
        0.22,
        7.6,
        0.08
      );

    const topHighlight =
      new THREE.Mesh(
        highlightGeo,
        pipeLightMat
      );

    topHighlight.position.set(
      -0.45,
      0,
      0.78
    );

    topBody.add(
      topHighlight
    );

    const bottomHighlight =
      new THREE.Mesh(
        highlightGeo,
        pipeLightMat
      );

    bottomHighlight.position.set(
      -0.45,
      0,
      0.78
    );

    bottomBody.add(
      bottomHighlight
    );

    /* CAP HIGHLIGHTS */

    const capLineGeo =
      new THREE.BoxGeometry(
        1.55,
        0.12,
        0.08
      );

    const capLineTop =
      new THREE.Mesh(
        capLineGeo,
        pipeLightMat
      );

    capLineTop.position.set(
      -0.1,
      0,
      0.94
    );

    topCap.add(
      capLineTop
    );

    const capLineBottom =
      new THREE.Mesh(
        capLineGeo,
        pipeLightMat
      );

    capLineBottom.position.set(
      -0.1,
      0,
      0.94
    );

    bottomCap.add(
      capLineBottom
    );

    /*
       Position:
       X = horizontal scrolling
    */

    group.position.set(
      x,
      0,
      0
    );

    group.userData.gapCenter =
      gapCenter;

    group.userData.gapHalf =
      gapHalf;

    group.userData.passed =
      false;

    scene.add(
      group
    );

    pipes.push(
      group
    );
  }

  /* =========================================================
     GAME STATE
  ========================================================= */

  let started = false;
  let running = false;
  let over = false;

  let score = 0;
  let hp = 3;

  let birdY = 3;
  let velocityY = 0;

  let invincible = 0;
  let elapsed = 0;

  let pipeTimer = 0;

  const hudScore =
    scoreEl || {
      textContent: ""
    };

  const hudHp =
    hpEl || {
      textContent: ""
    };

  /* =========================================================
     GAME OVER OVERLAY
  ========================================================= */

  const overlay =
    document.createElement(
      "div"
    );

  overlay.className =
    "game-overlay";

  overlay.innerHTML =
    `
      <h4>GAME OVER</h4>
      <p>
        SCORE: 0<br>
        TEKAN [R] / KLIK UNTUK ULANG
      </p>
    `;

  wrap.appendChild(
    overlay
  );

  const overlayText =
    overlay.querySelector(
      "p"
    );

  /* =========================================================
     HUD
  ========================================================= */

  function updateHud() {
    hudScore.textContent =
      String(score).padStart(
        6,
        "0"
      );

    hudHp.textContent =
      "♥".repeat(hp) +
      "♡".repeat(3 - hp);
  }

  /* =========================================================
     GAME RESET
  ========================================================= */

  function restart() {
    over = false;
    running = false;

    score = 0;
    hp = 3;

    birdY = 3;
    velocityY = 0;

    invincible = 0;
    pipeTimer = 0;

    pipes.forEach(
      (pipe) => {
        scene.remove(pipe);
      }
    );

    pipes.length = 0;

    bird.position.set(
      -3.5,
      3,
      1
    );

    bird.rotation.z = 0;

    overlay.classList.remove(
      "show"
    );

    updateHud();

    bird.visible = true;
  }

  /* =========================================================
     FLAP
  ========================================================= */

  function flap() {
    if (!started) return;

    if (over) return;

    running = true;

    velocityY = 6.6;
  }

  /* =========================================================
     INPUT
  ========================================================= */

  wrap.addEventListener(
    "click",
    () => {
      if (over) {
        restart();
      } else {
        flap();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (!started) return;
      if (document.getElementById("zoomModal").classList.contains("show")) return;
      if (document.getElementById("galleryModal").classList.contains("show")) return;

      if (
        e.key === " " ||
        e.key === "w" ||
        e.key === "W" ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault();

        if (over) {
          restart();
        } else {
          flap();
        }
      }

      if (
        e.key === "r" ||
        e.key === "R"
      ) {
        restart();
      }
    }
  );

  window.addEventListener(
    "game-start",
    () => {
      started = true;
      restart();
    }
  );

  /* =========================================================
     DAMAGE
  ========================================================= */

  function damage() {
    if (invincible > 0)
      return;

    hp--;

    invincible = 1.35;

    updateHud();

    if (hp <= 0) {
      die();
    }
  }

  /* =========================================================
     GAME OVER
  ========================================================= */

  function die() {
    over = true;
    running = false;

    overlayText.innerHTML =
      `
        SCORE: ${score}<br>
        TEKAN [R] / KLIK UNTUK ULANG
      `;

    overlay.classList.add(
      "show"
    );

    velocityY = -2;

    bird.rotation.z =
      -Math.PI * 0.45;
  }

  /* =========================================================
     RESIZE
  ========================================================= */

  function resize() {
    const w =
      wrap.clientWidth || 800;

    const h =
      wrap.clientHeight || 500;

    renderer.setSize(
      w,
      h,
      false
    );

    camera.aspect =
      w / h;

    camera.updateProjectionMatrix();
  }

  /* =========================================================
     COLLISION
  ========================================================= */

  function checkPipeCollision() {
    const birdX =
      bird.position.x;

    const birdHalfX =
      0.62;

    const birdTop =
      birdY + 0.48;

    const birdBottom =
      birdY - 0.48;

    for (const pipe of pipes) {
      const pipeLeft =
        pipe.position.x -
        0.95;

      const pipeRight =
        pipe.position.x +
        0.95;

      /*
         Horizontal overlap
      */

      if (
        birdX + birdHalfX >
          pipeLeft &&
        birdX - birdHalfX <
          pipeRight
      ) {
        const gapCenter =
          pipe.userData.gapCenter;

        const gapHalf =
          pipe.userData.gapHalf;

        const gapTop =
          gapCenter +
          gapHalf;

        const gapBottom =
          gapCenter -
          gapHalf;

        /*
           Hit top or bottom pipe
        */

        if (
          birdTop > gapTop ||
          birdBottom < gapBottom
        ) {
          damage();

          velocityY =
            Math.min(
              velocityY,
              -2.5
            );

          return true;
        }
      }
    }

    return false;
  }

  /* =========================================================
     PARTICLES
  ========================================================= */

  const particles = [];

  function spawnParticle() {
    const p =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.045,
          5,
          5
        ),
        toon(0xffffff)
      );

    p.position.set(
      bird.position.x -
        0.65,
      bird.position.y +
        (Math.random() - 0.5) *
          0.5,
      bird.position.z -
        0.1
    );

    p.userData.life =
      0.5;

    p.userData.vx =
      -1.2 -
      Math.random() *
        1.4;

    p.userData.vy =
      (Math.random() - 0.5) *
      1.5;

    scene.add(p);

    particles.push(p);
  }

  function updateParticles(dt) {
    for (
      let i = particles.length - 1;
      i >= 0;
      i--
    ) {
      const p =
        particles[i];

      p.userData.life -= dt;

      p.position.x +=
        p.userData.vx * dt;

      p.position.y +=
        p.userData.vy * dt;

      p.scale.multiplyScalar(
        0.96
      );

      if (
        p.userData.life <= 0
      ) {
        scene.remove(p);

        particles.splice(
          i,
          1
        );
      }
    }
  }

  /* =========================================================
     ANIMATION
  ========================================================= */

  let last =
    performance.now();

  function animate(now) {
    requestAnimationFrame(
      animate
    );

    const dt =
      Math.min(
        (now - last) / 1000,
        0.05
      );

    last = now;

    elapsed += dt;

    /* -----------------------------------------
       CLOUD MOVEMENT
    ----------------------------------------- */

    clouds.forEach(
      (cloud) => {
        cloud.position.x +=
          cloud.userData.speed *
          dt;

        if (
          cloud.position.x >
          21
        ) {
          cloud.position.x =
            -21;
        }
      }
    );

    /* -----------------------------------------
       PARTICLES
    ----------------------------------------- */

    updateParticles(dt);

    /* -----------------------------------------
       GAME
    ----------------------------------------- */

    if (started) {
      if (
        running &&
        !over
      ) {
        /* ================================
           BIRD PHYSICS
        ================================= */

        velocityY -=
          14 * dt;

        velocityY =
          Math.max(
            velocityY,
            -10
          );

        birdY +=
          velocityY * dt;

        /* ================================
           PIPE SPAWN
        ================================= */

        pipeTimer += dt;

        if (
          pipeTimer >
          1.65
        ) {
          makePipe(12);

          pipeTimer = 0;
        }

        /* ================================
           PIPE SPEED
        ================================= */

        const pipeSpeed =
          4.2 +
          Math.min(
            score * 0.035,
            2
          );

        /* ================================
           PIPE MOVEMENT
        ================================= */

        for (
          let i = pipes.length - 1;
          i >= 0;
          i--
        ) {
          const pipe =
            pipes[i];

          pipe.position.x -=
            pipeSpeed * dt;

          /* SCORE */

          if (
            !pipe.userData.passed &&
            pipe.position.x <
              bird.position.x -
                0.8
          ) {
            pipe.userData.passed =
              true;

            score++;

            updateHud();

            /*
               small celebration
            */

            for (
              let j = 0;
              j < 4;
              j++
            ) {
              spawnParticle();
            }
          }

          /* REMOVE */

          if (
            pipe.position.x <
            -14
          ) {
            scene.remove(
              pipe
            );

            pipes.splice(
              i,
              1
            );
          }
        }

        /* ================================
           GROUND
        ================================= */

        if (
          birdY <
          0.52
        ) {
          birdY =
            0.52;

          damage();

          velocityY =
            4.2;
        }

        /* ================================
           CEILING
        ================================= */

        if (
          birdY >
          7.8
        ) {
          birdY =
            7.8;

          velocityY =
            -1;
        }

        /* ================================
           PIPE COLLISION
        ================================= */

        if (!over) {
          checkPipeCollision();
        }

        /* ================================
           BIRD ROTATION
        ================================= */

        const targetRotation =
          THREE.MathUtils.clamp(
            velocityY * 0.075,
            -0.55,
            0.55
          );

        bird.rotation.z +=
          (
            targetRotation -
            bird.rotation.z
          ) *
          0.14;

        /* ================================
           TRAIL
        ================================= */

        if (
          Math.random() <
          0.18
        ) {
          spawnParticle();
        }
      }

      /* -----------------------------------
         READY STATE
      ----------------------------------- */

      else if (
        !running &&
        !over
      ) {
        birdY =
          3 +
          Math.sin(
            elapsed * 2.6
          ) *
            0.2;

        bird.rotation.z =
          Math.sin(
            elapsed * 2.6
          ) *
            0.05;
      }

      /* -----------------------------------
         GAME OVER FALL
      ----------------------------------- */

      else if (over) {
        velocityY -=
          14 * dt;

        birdY +=
          velocityY * dt;

        if (
          birdY <
          0.55
        ) {
          birdY =
            0.55;
        }

        bird.rotation.z -=
          2.2 * dt;
      }

      bird.position.y =
        birdY;
    }

    /* =======================================================
       WING ANIMATION
    ======================================================= */

    const wingSpeed =
      running && !over
        ? 18
        : 3;

    const wingAngle =
      Math.sin(
        elapsed *
          wingSpeed
      ) * 0.5;

    wingGroup.rotation.z =
      wingAngle;

    wingBack.rotation.z =
      -wingAngle * 0.7;

    /* =======================================================
       BIRD BLINK
    ======================================================= */

    if (
      running &&
      !over &&
      Math.sin(elapsed * 2.7) >
        0.98
    ) {
      face.scale.y = 0.75;
    } else {
      face.scale.y = 1;
    }

    /* =======================================================
       INVINCIBILITY FLASH
    ======================================================= */

    invincible =
      Math.max(
        0,
        invincible - dt
      );

    if (
      invincible > 0
    ) {
      bird.visible =
        Math.floor(
          invincible * 12
        ) %
          2 ===
        0;
    } else {
      bird.visible = true;
    }

    /* =======================================================
       PARALLAX
    ======================================================= */

    mountains.position.x =
      Math.sin(
        elapsed * 0.08
      ) *
      0.2;

    /* =======================================================
       RENDER
    ======================================================= */

    renderer.render(
      scene,
      camera
    );
  }

  /* =========================================================
     START
  ========================================================= */

  resize();

  window.addEventListener(
    "resize",
    resize
  );

  updateHud();

  requestAnimationFrame(
    animate
  );
})();