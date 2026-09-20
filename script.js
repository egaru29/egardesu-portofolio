/* ---------- Pixel grid background ---------- */
(function drawGrid() {
  const canvas = document.getElementById("pixelGrid");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const cell = 40;
  function resize() {
    canvas.width = Math.ceil(window.innerWidth / cell) * cell;
    canvas.height = Math.ceil(window.innerHeight / cell) * cell;
  }
  resize();
  window.addEventListener("resize", resize);

  const shades = ["#1d0f33", "#22133d", "#180b2b", "#271648"];
  ctx.fillStyle = "#12081f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += cell) {
    for (let x = 0; x < canvas.width; x += cell) {
      if (Math.random() > 0.78) {
        ctx.fillStyle = shades[(Math.random() * shades.length) | 0];
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }
})();

/* ---------- Sprite renderer ---------- */
const PALETTE = {
  R: "#ef4444", W: "#ffffff", Y: "#facc15", G: "#22c55e",
  B: "#b45309", S: "#cbd5e1", L: "#f472b6", T: "#a16207",
  D: "#1e293b", P: "#a78bfa", K: "#7c3aed", C: "#22d3ee",
  M: "#3b2f2f", N: "#0d0618", E: "#8b5cf6", U: "#6d28d9",
};

const SPRITES = {
  food: {
    map: [
      "..........",
      "..TTTTTT..",
      ".TTTTTTTT.",
      ".TTTTTTTT.",
      ".GGGGGGGG.",
      ".BBBBBBBB.",
      ".YYYYYYYY.",
      ".RRRRRRRR.",
      "..TTTTTT..",
      "..........",
    ],
    scale: 3,
  },
  travel: {
    map: [
      "..........",
      "......C...",
      ".....CCC..",
      "...CCCCC..",
      "CCCCCCCCCC",
      "CCCCCCCCCC",
      "...CCCCC..",
      ".....CCC..",
      "......C...",
      "..........",
    ],
    scale: 3,
  },
  school: {
    map: [
      "..........",
      "..BBBBBB..",
      ".BBBBBBBB.",
      "BWWWWYYWWB",
      "BWWWYYWWWB",
      ".BBBBBBBB.",
      "..BBBBB...",
      "..........",
      "..........",
      "..........",
    ],
    scale: 3,
  },
  services: {
    map: [
      "..........",
      "..SSSSSS..",
      ".SSSSSSSS.",
      "SKKKKKKKS",
      "SKKKKKKKS",
      "SKKKKKKKS",
      ".SSSSSSSS.",
      "..SSSSSS..",
      "...SSSS...",
      "..........",
    ],
    scale: 3,
  },
  apparel: {
    map: [
      "..........",
      "..........",
      "...SSSS...",
      "..SSSSSS..",
      ".SSSSSSSS.",
      "SSSSSSSSSS",
      "SSSSSSSSSS",
      ".SSSSSSSS.",
      "..SSSSSS..",
      "..........",
    ],
    scale: 3,
  },
  printing: {
    map: [
      "..........",
      "..WWWWWW..",
      "..WWWWWW..",
      "..PPPPPP..",
      ".PPPPPPPP.",
      ".PPKPPKPP.",
      ".PPPPPPPP.",
      "...P..P...",
      "..........",
      "..........",
    ],
    scale: 3,
  },
  gamestore: {
    map: [
      "..........",
      "..GGGGGG..",
      ".GGGGGGGG.",
      "GGKGGGGKGG",
      "GGGGGGGGGG",
      "GGGGGGGGGG",
      ".GGGGGGGG.",
      "..GG..GG..",
      "..GG..GG..",
      "..........",
    ],
    scale: 3,
  },
  avatar: {
    map: [
      "..DDDDDD..",
      ".DWWDDWWD.",
      ".DWWDDWWD.",
      "..DDDDDD..",
      ".DNWDDWND.",
      ".DNWDDWND.",
      "..DDDDDD..",
      ".DDDDDDDD.",
      ".DPDDDDDP.",
      "..DDDDDD..",
    ],
    scale: 4,
  },
};

function spriteToDataURL(spec) {
  const rows = spec.map.length;
  const cols = spec.map[0].length;
  const size = spec.scale;
  const canvas = document.createElement("canvas");
  canvas.width = cols * size;
  canvas.height = rows * size;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = spec.map[r][c];
      if (ch === "." || ch === " ") continue;
      ctx.fillStyle = PALETTE[ch] || "#ffffff";
      ctx.fillRect(c * size, r * size, size, size);
    }
  }
  return canvas.toDataURL();
}

function renderSprites(scope) {
  (scope || document).querySelectorAll(".sprite[data-sprite]").forEach((el) => {
    const key = el.dataset.sprite;
    if (SPRITES[key]) el.style.backgroundImage = `url(${spriteToDataURL(SPRITES[key])})`;
  });
}
renderSprites();

/* ---------- Nav ---------- */
const navEl = document.querySelector(".nav");
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ---------- Works filter ---------- */
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".work-card");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((f) => f.classList.remove("active"));
    filter.classList.add("active");

    const cat = filter.dataset.filter;
    cards.forEach((card) => {
      const show = cat === "all" || card.dataset.cat === cat;
      card.classList.add("fade");
      setTimeout(() => {
        card.classList.toggle("hidden", !show);
        card.classList.remove("fade");
      }, 120);
    });
  });
});

/* ---------- Contact form ---------- */
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "> QUEST BERHASIL DIKIRIM! +50 XP";
  status.classList.add("show");
  form.reset();
  setTimeout(() => status.classList.remove("show"), 5000);
});

/* ---------- Category gallery ---------- */
const GALLERY = {
  fnb: {
    label: "FOOD & BEVERAGES",
    title: "KEDAI NENEK",
    accent: "#f472b6",
    sprite: "food",
    desc: "Desain sosmed harian untuk brand F&B: menu, promo paket, dan cerita dapur.",
    items: [
      { type: "FEED", name: "MENU HIGHLIGHT" },
      { type: "FEED", name: "PROMO PAKET" },
      { type: "STORY", name: "STORY HARIAN DAPUR" },
      { type: "POSTER", name: "BUKA BERSAMA" },
      { type: "CAROUSEL", name: "TIPS KULINER 5 SLIDE" },
      { type: "ADS", name: "IKLAN MENU BARU" },
    ],
  },
  travel: {
    label: "TRAVEL",
    title: "PESONA NUSANTARA",
    accent: "#22d3ee",
    sprite: "travel",
    desc: "Konten destinasi wisata: feed memukau, itinerary, dan paket promo liburan.",
    items: [
      { type: "FEED", name: "FEED DESTINASI" },
      { type: "FEED", name: "CULTURE HIGHLIGHT" },
      { type: "CAROUSEL", name: "GUIDE ITINERARY" },
      { type: "POSTER", name: "PROMO PACKAGE" },
      { type: "STORY", name: "COUNTDOWN HARI-H" },
      { type: "ADS", name: "IKLAN LIBURAN" },
    ],
  },
  school: {
    label: "SCHOOL",
    title: "SMK PIXEL ART",
    accent: "#facc15",
    sprite: "school",
    desc: "Media sosial sekolah: branding info, PPDB, dan dokumentasi kegiatan.",
    items: [
      { type: "POSTER", name: "PPDB 2026" },
      { type: "FEED", name: "HIGHLIGHT JURUSAN" },
      { type: "CAROUSEL", name: "INFO PROGRAM" },
      { type: "STORY", name: "KEGIATAN SEKOLAH" },
      { type: "BANNER", name: "BANNER WEB" },
      { type: "POSTER", name: "POSTER EVENT" },
    ],
  },
  services: {
    label: "SERVICES",
    title: "BUANA TECH",
    accent: "#4ade80",
    sprite: "services",
    desc: "Konten jasa & solusi digital: layanan, testimoni klien, dan soft promotion.",
    items: [
      { type: "FEED", name: "FEED LAYANAN" },
      { type: "CAROUSEL", name: "TESTIMONI KLIEN" },
      { type: "POSTER", name: "PROMO QUARTER" },
      { type: "STORY", name: "TIPS TEKNOLOGI" },
      { type: "ADS", name: "LANDING ADS" },
      { type: "BANNER", name: "SLIDER WEB" },
    ],
  },
  apparel: {
    label: "APPAREL",
    title: "THREADLINE CO.",
    accent: "#a78bfa",
    sprite: "apparel",
    desc: "Fashion & merchandise: lookbook, drop terbatas, dan launching koleksi.",
    items: [
      { type: "FEED", name: "LOOKBOOK" },
      { type: "CAROUSEL", name: "DROP KETERBATASAN" },
      { type: "POSTER", name: "KOLEKSI BARU" },
      { type: "STORY", name: "LAUNCH DAY" },
      { type: "ADS", name: "IKLAN SHOP" },
      { type: "COVER", name: "COVER REELS" },
    ],
  },
  print: {
    label: "PRINTING",
    title: "CETAK KILAT",
    accent: "#fb923c",
    sprite: "printing",
    desc: "Usaha percetakan: promo harga, produk cetak, dan pelayanan pelanggan.",
    items: [
      { type: "POSTER", name: "PROMO CETAK" },
      { type: "FEED", name: "PRODUK & SAMPLE" },
      { type: "CAROUSEL", name: "DAFTAR HARGA" },
      { type: "STORY", name: "ORDER & PROSES" },
      { type: "ADS", name: "IKLAN LAYANAN" },
      { type: "BANNER", name: "BANNER TOKO" },
    ],
  },
  gamestore: {
    label: "GAME STORE",
    title: "RETROPLAY SHOP",
    accent: "#e879f9",
    sprite: "gamestore",
    desc: "Toko game & top-up: release baru, voucher murah, dan event komunitas.",
    items: [
      { type: "POSTER", name: "RELEASE GAME" },
      { type: "FEED", name: "TOP-UP MURAH" },
      { type: "CAROUSEL", name: "DAFTAR VOUCHER" },
      { type: "STORY", name: "EVENT & TURNAMEN" },
      { type: "ADS", name: "IKLAN MARKETPLACE" },
      { type: "COVER", name: "COVER STREAM" },
    ],
  },
};

const modal = document.getElementById("galleryModal");
const galCat = document.getElementById("galCat");
const galTitle = document.getElementById("galTitle");
const galDesc = document.getElementById("galDesc");
const galGrid = document.getElementById("galGrid");
const galCount = document.getElementById("galCount");
const galKeyOrder = Object.keys(GALLERY);
let galIndex = 0;

function renderGallery(key) {
  const data = GALLERY[key];
  const idx = galKeyOrder.indexOf(key);
  galIndex = idx;
  galCat.textContent = `[ ${data.label} ]`;
  galTitle.textContent = data.title;
  galDesc.textContent = data.desc;
  galCount.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(galKeyOrder.length).padStart(2, "0")}`;

  galGrid.innerHTML = data.items
    .map((item, i) => `
      <div class="gal-tile" style="--accent:${data.accent}" data-sprite="${data.sprite}" data-zoom="${i}">
        <span class="gal-idx">0${i + 1}</span>
        <div class="sprite tile-art" data-sprite="${data.sprite}"></div>
        <div class="tile-info">
          <span class="gal-type">[ ${item.type} ]</span>
          <strong>${item.name}</strong>
        </div>
      </div>
    `)
    .join("");
  renderSprites(galGrid);
  galGrid.querySelectorAll(".gal-tile").forEach((tile) => {
    tile.addEventListener("click", () => openZoom(key, Number(tile.dataset.zoom)));
  });
}

function openGallery(key) {
  renderGallery(key);
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeGallery() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (GALLERY[card.dataset.cat]) openGallery(card.dataset.cat);
  });
});

document.getElementById("galleryClose").addEventListener("click", closeGallery);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeGallery();
});
document.getElementById("galPrev").addEventListener("click", () => {
  renderGallery(galKeyOrder[(galIndex - 1 + galKeyOrder.length) % galKeyOrder.length]);
});
document.getElementById("galNext").addEventListener("click", () => {
  renderGallery(galKeyOrder[(galIndex + 1) % galKeyOrder.length]);
});
document.addEventListener("keydown", (e) => {
  if (zModal.classList.contains("show")) return;
  if (modal.classList.contains("show") && e.key === "Escape") closeGallery();
});

/* ---------- Tile click → zoom lightbox ---------- */
let zoomKey = null;
let zoomItemIndex = 0;

const zModal = document.getElementById("zoomModal");
const zTarget = document.getElementById("zoomTarget");
const zCanvas = document.getElementById("zoomCanvas");
const zLabel = document.getElementById("zoomLabel");
const zCount = document.getElementById("zoomCount");
const zIn = document.getElementById("zoomIn");
const zOut = document.getElementById("zoomOut");
const zReset = document.getElementById("zoomReset");
const zPrev = document.getElementById("zoomPrev");
const zNext = document.getElementById("zoomNext");

let zScale = 1;
let zOffsetX = 0;
let zOffsetY = 0;
let dragState = null;
let didDrag = false;

function applyZoom() {
  zTarget.style.transform = `translate(${zOffsetX}px, ${zOffsetY}px) scale(${zScale})`;
  zLabel.textContent = `${zScale.toFixed(1)}×`;
  zIn.disabled = zScale >= 4;
  zOut.disabled = zScale <= 1;
}

function renderZoom(key, itemIndex) {
  const data = GALLERY[key];
  const item = data.items[itemIndex];
  zTarget.innerHTML = `
    <div class="zoom-tile" style="--accent:${data.accent}">
      <span class="gal-idx">0${itemIndex + 1} — ${data.title}</span>
      <div class="sprite tile-art" data-sprite="${data.sprite}"></div>
      <div class="tile-info">
        <span class="gal-type">[ ${item.type} ] • ${data.label}</span>
        <strong>${item.name}</strong>
      </div>
    </div>
  `;
  renderSprites(zTarget);
  zCount.textContent = `${String(itemIndex + 1).padStart(2, "0")} / ${String(data.items.length).padStart(2, "0")}`;
}

function openZoom(key, itemIndex) {
  zoomKey = key;
  zoomItemIndex = itemIndex;
  zScale = 1;
  zOffsetX = 0;
  zOffsetY = 0;
  renderZoom(key, itemIndex);
  applyZoom();
  zModal.classList.add("show");
  zModal.setAttribute("aria-hidden", "false");
}

function closeZoom() {
  zModal.classList.remove("show");
  zModal.setAttribute("aria-hidden", "true");
  dragState = null;
  didDrag = false;
}

function zoomAt(factor, cx, cy) {
  const rect = zCanvas.getBoundingClientRect();
  const prev = zScale;
  zScale = Math.min(4, Math.max(1, zScale * factor));
  if (cx !== undefined) {
    const px = (cx - rect.left - rect.width / 2 - zOffsetX) / prev;
    const py = (cy - rect.top - rect.height / 2 - zOffsetY) / prev;
    zOffsetX = cx - rect.left - rect.width / 2 - px * zScale;
    zOffsetY = cy - rect.top - rect.height / 2 - py * zScale;
  } else {
    zOffsetX *= zScale / prev;
    zOffsetY *= zScale / prev;
  }
  applyZoom();
}

function stepZoom(delta) {
  const rect = zCanvas.getBoundingClientRect();
  zoomAt(delta, rect.left + rect.width / 2, rect.top + rect.height / 2);
}

/* render scale + pan */
zCanvas.addEventListener("pointerdown", (e) => {
  didDrag = false;
  dragState = { x: e.clientX - zOffsetX, y: e.clientY - zOffsetY, active: true };
  zCanvas.classList.add("dragging");
  zCanvas.setPointerCapture(e.pointerId);
});
zCanvas.addEventListener("pointermove", (e) => {
  if (!dragState || !dragState.active) return;
  const nx = e.clientX - dragState.x;
  const ny = e.clientY - dragState.y;
  if (Math.hypot(nx - zOffsetX, ny - zOffsetY) > 4) didDrag = true;
  zOffsetX = nx;
  zOffsetY = ny;
  applyZoom();
});
zCanvas.addEventListener("pointerup", () => {
  dragState = null;
  zCanvas.classList.remove("dragging");
});

zCanvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY);
});

zIn.addEventListener("click", () => stepZoom(1.25));
zOut.addEventListener("click", () => stepZoom(1 / 1.25));
zReset.addEventListener("click", () => {
  zScale = 1;
  zOffsetX = 0;
  zOffsetY = 0;
  applyZoom();
});
zPrev.addEventListener("click", () => {
  zoomItemIndex = (zoomItemIndex - 1 + GALLERY[zoomKey].items.length) % GALLERY[zoomKey].items.length;
  renderZoom(zoomKey, zoomItemIndex);
});
zNext.addEventListener("click", () => {
  zoomItemIndex = (zoomItemIndex + 1) % GALLERY[zoomKey].items.length;
  renderZoom(zoomKey, zoomItemIndex);
});
document.getElementById("zoomClose").addEventListener("click", closeZoom);
zModal.addEventListener("click", (e) => {
  if (e.target === zModal || e.target === zCanvas) {
    if (!didDrag) closeZoom();
  }
});

document.addEventListener("keydown", (e) => {
  if (!zModal.classList.contains("show")) return;
  if (e.key === "Escape") closeZoom();
  if (e.key === "+" || e.key === "=") stepZoom(1.25);
  if (e.key === "-" || e.key === "_") stepZoom(1 / 1.25);
  if (e.key === "ArrowLeft") zPrev.click();
  if (e.key === "ArrowRight") zNext.click();
  if (e.key === "0") zReset.click();
});