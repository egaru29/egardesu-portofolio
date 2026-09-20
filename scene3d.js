(function () {
  const wrap = document.getElementById("hero3d");
  if (!wrap || !window.THREE) return;

  function makeCanvas(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    return c;
  }
  function tex(c) {
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    return t;
  }
  const GMAP = (function () {
    const c = makeCanvas(4, 1, function (ctx) {
      const g = ctx.createLinearGradient(0, 0, 4, 0);
      g.addColorStop(0, "#0d0d0f");
      g.addColorStop(0.32, "#5a5a5a");
      g.addColorStop(0.68, "#bfbfbf");
      g.addColorStop(1, "#ffffff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 1);
    });
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    return t;
  })();
  const toon = function (color) {
    return new THREE.MeshToonMaterial({ color: color, gradientMap: GMAP });
  };
  const base = function (color, opts) {
    return new THREE.MeshBasicMaterial(Object.assign({ color: color }, opts || {}));
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.15, 8.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(1);
  wrap.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x7c3aed, 1.15));
  const key = new THREE.DirectionalLight(0xfff4e0, 1.05);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa78bfa, 0.65);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const KIRBY = 0xffa9cf;
  const KIRBY_D = 0xf28fbd;
  const KIRBY_L = 0xffc3dc;
  const EYE = 0x101012;
  const BLUSH = 0xf8717a;
  const ACCENT = 0x7c3aed;
  const ACCENT_L = 0xa78bfa;

  const hero = new THREE.Group();

  /* ---------- body (Kirby ball) ---------- */
  const R = 0.98;
  const body = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 28), toon(KIRBY));
  hero.add(body);

  /* soft top shine */
  const shineTex = tex(
    makeCanvas(64, 64, function (ctx) {
      const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
      g.addColorStop(0, "rgba(255,235,245,0.8)");
      g.addColorStop(1, "rgba(255,235,245,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    })
  );
  const shine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.7),
    base(0xffffff, { map: shineTex, transparent: true, depthWrite: false })
  );
  shine.position.set(-0.28, 0.4, R + 0.02);
  hero.add(shine);

  /* ---------- feet (ovals) ---------- */
  const footGeo = new THREE.SphereGeometry(0.24, 18, 14);
  const footL = new THREE.Mesh(footGeo, toon(KIRBY_D));
  footL.scale.set(1.15, 0.42, 1.6);
  footL.position.set(-0.26, -0.84, 0.24);
  footL.rotation.z = -0.35;
  const footR = footL.clone();
  footR.scale.set(1.15, 0.42, 1.6);
  footR.position.set(0.26, -0.84, 0.24);
  footR.rotation.z = 0.35;
  hero.add(footL, footR);

  /* ---------- arms (nub) ---------- */
  const armGeo = new THREE.SphereGeometry(0.26, 18, 14);
  const armL = new THREE.Mesh(armGeo, toon(KIRBY));
  armL.scale.set(0.75, 0.95, 0.8);
  armL.position.set(-0.98, 0.16, 0.08);
  armL.rotation.z = 0.25;
  const armR = armL.clone();
  armR.position.set(0.98, 0.16, 0.08);
  armR.rotation.z = -0.25;
  hero.add(armL, armR);

  /* ---------- face ---------- */
  const faceZ = R + 0.02;

  function makeEye(side) {
    const g = new THREE.Group();
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), toon(EYE));
    eye.scale.set(0.55, 0.68, 0.35);
    g.add(eye);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), toon(0xffffff));
    glint.position.set(-0.06, 0.08, 0.1);
    g.add(glint);
    const glint2 = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), toon(0xffffff));
    glint2.position.set(0.05, -0.05, 0.11);
    g.add(glint2);
    g.position.set(side * 0.27, 0.17, faceZ);
    g.rotation.z = side * -0.14;
    return g;
  }
  const eyeL = makeEye(-1);
  const eyeR = makeEye(1);
  hero.add(eyeL, eyeR);
  const blinkEyes = [eyeL, eyeR];

  /* blush: diagonal orange bars */
  const blushMat = toon(BLUSH);
  const blushGeo = new THREE.BoxGeometry(0.22, 0.07, 0.02);
  const blushL = new THREE.Mesh(blushGeo, blushMat);
  blushL.position.set(-0.52, -0.04, faceZ);
  blushL.rotation.z = -0.5;
  const blushR = new THREE.Mesh(blushGeo, blushMat);
  blushR.position.set(0.52, -0.04, faceZ);
  blushR.rotation.z = 0.5;
  hero.add(blushL, blushR);

  /* tiny smile */
  const mouthTex = makeCanvas(48, 24, function (ctx) {
    ctx.strokeStyle = "#c25570";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(24, 14, 12, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  });
  const mouth = new THREE.Mesh(
    new THREE.PlaneGeometry(0.2, 0.1),
    base(0xffffff, { map: tex(mouthTex), transparent: true, depthWrite: false })
  );
  mouth.position.set(0, -0.28, faceZ);
  hero.add(mouth);

  hero.position.y = 0.55;
  scene.add(hero);

  /* ---------- purple star (brand accent) ---------- */
  function starGeo(outer, inner, points) {
    const shape = new THREE.Shape();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
    geo.center();
    return geo;
  }
  const starMat = toon(ACCENT);
  const starBig = new THREE.Mesh(starGeo(0.26, 0.11, 5), starMat);
  starBig.position.set(1.4, 0.75, 0.5);
  scene.add(starBig);
  const starSmall = new THREE.Mesh(starGeo(0.16, 0.07, 5), toon(ACCENT_L));
  starSmall.position.set(-1.5, 1.05, -0.1);
  scene.add(starSmall);

  /* shadow */
  const shadowTex = tex(
    makeCanvas(128, 128, function (ctx) {
      const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
      g.addColorStop(0, "rgba(18,8,31,0.5)");
      g.addColorStop(1, "rgba(18,8,31,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    })
  );
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    base(0xffffff, { map: shadowTex, transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -1.05, 0);
  scene.add(shadow);

  /* sparkles */
  const sparkMat = base(0xffffff, { transparent: true, opacity: 0.6, depthWrite: false });
  const sparkles = [];
  for (let i = 0; i < 20; i++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.04, 0), sparkMat);
    m.position.set((Math.random() - 0.5) * 4.6, -0.2 + Math.random() * 3.6, (Math.random() - 0.5) * 3);
    sparkles.push(m);
    scene.add(m);
  }

  /* ---------- interaction ---------- */
  const target = { x: 0, y: 0 };
  const look = { yaw: 0, pitch: 0 };
  let reaction = 0;
  let blinkAt = 2.5 + Math.random() * 2;
  let blinkT = 0;

  window.addEventListener("mousemove", function (e) {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  wrap.addEventListener("click", function () {
    reaction = 1;
  });

  document.addEventListener("keydown", function (e) {
    if (document.getElementById("zoomModal").classList.contains("show")) return;
    if (document.getElementById("galleryModal").classList.contains("show")) return;
    if (e.key === " " || e.key === "Enter") reaction = 1;
  });

  let last = performance.now();
  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;

    look.yaw += (target.x * 0.45 - look.yaw) * Math.min(0.08, dt * 3);
    look.pitch += (-target.y * 0.35 - look.pitch) * Math.min(0.08, dt * 3);
    hero.rotation.y = look.yaw;
    hero.rotation.x = look.pitch;
    hero.rotation.z = target.x * 0.03 + (reaction ? 0.1 : 0);

    /* idle squash & stretch */
    const breathe = Math.sin(t * 2.1) * 0.02;
    body.scale.set(1 - breathe * 0.5, 1 + breathe, 1 - breathe * 0.5);

    hero.position.y = 0.55 + Math.sin(t * 1.4) * 0.05 + reaction * 0.35;

    eyeL.position.x = -0.27 + target.x * 0.02;
    eyeL.position.y = 0.17 + target.y * 0.015;
    eyeR.position.x = 0.27 + target.x * 0.02;
    eyeR.position.y = 0.17 + target.y * 0.015;

    blinkT -= dt;
    if (blinkT <= 0) {
      blinkAt = 2.5 + Math.random() * 2.5;
      blinkT = blinkAt;
    }
    const blinkPhase = blinkT > blinkAt - 0.09 ? blinkT - (blinkAt - 0.09) : 1;
    const squash = blinkPhase < 0.09 ? Math.abs(Math.sin((blinkPhase / 0.09) * Math.PI)) : 1;
    blinkEyes.forEach(function (e) { e.scale.set(1, squash, 1); });

    reaction = Math.max(0, reaction - dt * 1.2);
    armL.rotation.z = 0.25 - reaction * 0.5;
    armR.rotation.z = -0.25 + reaction * 0.5;

    starBig.rotation.z += dt * 0.6;
    starSmall.rotation.z -= dt * 0.45;
    starBig.position.y = 0.75 + Math.sin(t * 1.6) * 0.06;
    starSmall.position.y = 1.05 + Math.cos(t * 1.3) * 0.05;

    sparkles.forEach(function (s, i) {
      s.position.x += Math.sin(t * 0.6 + i) * 0.0008;
      s.position.y += Math.sin(t * 0.9 + i * 1.7) * 0.0009;
      s.rotation.z += 0.01;
    });

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(animate);
})();