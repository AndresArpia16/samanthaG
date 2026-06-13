/* ==============================
   GALAXIA DE AMOR — script.js
   ============================== */

/* ─────────────────────────────
   1. CONFIGURACIÓN EDITABLE
────────────────────────────── */
const nombre = "Samantha";

const carta = `Mi amor,

Hola, la verdad no soy muy bueno en esto de escribir cartas pero quiero que sepas cuánto te amo y que te aprecio mucho,
este año no me imagine en a ver conocido a una persona tan especial como tú siento que cuando estoy contigo 
todo es mejor, me gustaria seguir estando contigo y que me perdones cada vez que diga algo que no debería
decir, te quiero con todo mi corazon .`;

const dedicatorias = [
  "Eres la luz que ilumina mis días más oscuros... ❤️",
  "Contigo aprendí que el amor puede ser más grande que el universo ✨",
  "Cada momento contigo es un recuerdo que atesoro para siempre 💫",
  "Tu sonrisa es lo más hermoso que han visto mis ojos ❤️",
  "En tus ojos encontré mi lugar favorito en el mundo 🌹",
  "Gracias por ser exactamente como eres... perfecta para mí ❤️",
  "Eres la razón por la que creo en la magia del amor 💖",
  "Juntos somos una historia de amor digna de las estrellas ✨",
  "Mi corazón te eligió a ti, y lo elegiría mil veces más ❤️",
  "Eres mi paz, mi alegría, mi todo 💫",
];

const mensajesFlotantes = [
  "Te Amo ❤️",
  "Mi Amor ❤️",
  "Amor Eterno ❤️",
  "Eres Mi Universo ❤️",
  "Mi Lugar Favorito Eres Tú ❤️",
  "Mi Persona Especial ❤️",
  "Gracias Por Existir ❤️",
  "Contigo Todo Es Mejor ❤️",
  "Eres Mi Destino ❤️",
  "Amor Infinito ❤️",
];

const fotos = [
  "img/foto1.jpg",
  "img/foto2.jpg",
  "img/foto3.jpg",
  "img/foto4.jpg",
  "img/foto5.jpg",
];

/* ─────────────────────────────
   2. CANVAS — GALAXIA
────────────────────────────── */
const canvas = document.getElementById("galaxyCanvas");
const ctx = canvas.getContext("2d");

let W, H, cx, cy;
let particles = [];
let nebulaPoints = [];
let stars = [];
let speedMultiplier = 1;
let isExplosion = false;
let explosionTimer = 0;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cx = W / 2;
  cy = H / 2;
}
resizeCanvas();

/* Stars */
function initStars() {
  stars = [];
  const count = Math.min(280, Math.floor(W * H / 5000));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * 0.015 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

/* Nebula */
function initNebula() {
  nebulaPoints = [];
  for (let i = 0; i < 6; i++) {
    nebulaPoints.push({
      x: cx + (Math.random() - 0.5) * W * 0.7,
      y: cy + (Math.random() - 0.5) * H * 0.7,
      r: Math.random() * Math.min(W, H) * 0.28 + 60,
    });
  }
}

/* Galaxy particles */
function initParticles() {
  particles = [];
  const count = Math.min(1800, Math.floor(W * H / 800));

  for (let i = 0; i < count; i++) {
    const arm   = Math.floor(Math.random() * 3);
    const t     = Math.random();
    const armAngle = (arm * Math.PI * 2) / 3;
    const spread   = (Math.random() - 0.5) * 0.7;
    const dist     = 40 + t * Math.min(W, H) * 0.42;
    const angle    = armAngle + t * Math.PI * 3.5 + spread;
    const depth    = 0.4 + Math.random() * 0.6;

    particles.push({
      baseAngle: angle, angle, dist,
      speed: (0.0004 + Math.random() * 0.0006) / (0.3 + t * 0.7),
      size:  (Math.random() * 1.8 + 0.4) * depth,
      alpha: (0.3  + Math.random() * 0.7) * depth,
      r: Math.floor(200 + Math.random() * 55),
      g: Math.floor(Math.random() * 40),
      b: Math.floor(Math.random() * 60),
      depth,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.04 + 0.01,
    });
  }

  /* Heart particles (centro) */
  for (let i = 0; i < 300; i++) {
    const t2 = (i / 300) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t2), 3);
    const hy = -(13*Math.cos(t2) - 5*Math.cos(2*t2) - 2*Math.cos(3*t2) - Math.cos(4*t2));
    const scale = 3.2 + Math.random() * 1.5;
    const jitter = (Math.random() - 0.5) * 4;
    const colors = [
      {r:255,g:20,b:60},{r:255,g:80,b:110},{r:255,g:160,b:180},{r:255,g:255,b:255},
    ];
    const c = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      baseAngle: Math.atan2(hy, hx) + jitter * 0.01,
      angle:     Math.atan2(hy, hx) + jitter * 0.01,
      dist: Math.sqrt(hx*hx + hy*hy) * scale + jitter,
      speed: 0,
      size: Math.random() * 2.2 + 0.8,
      alpha: 0.5 + Math.random() * 0.5,
      r:c.r, g:c.g, b:c.b, depth:1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.06 + 0.02,
      isHeart: true,
    });
  }

  initStars();
  initNebula();
}

function drawNebula() {
  nebulaPoints.forEach(np => {
    const grad = ctx.createRadialGradient(np.x, np.y, 0, np.x, np.y, np.r);
    grad.addColorStop(0, "rgba(120,0,20,0.06)");
    grad.addColorStop(0.5, "rgba(80,0,15,0.04)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(np.x, np.y, np.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawStars() {
  stars.forEach(s => {
    s.phase += s.twinkle;
    const a = s.alpha * (0.5 + 0.5 * Math.sin(s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,200,210,${a})`;
    ctx.fill();
  });
}

function drawParticles() {
  const speed = speedMultiplier * (isExplosion ? 4 : 1);
  particles.forEach(p => {
    if (!p.isHeart) p.angle += p.speed * speed;
    p.pulse += p.pulseSpeed;
    const pAlpha = p.alpha * (0.75 + 0.25 * Math.sin(p.pulse));
    const pSize  = p.size  * (0.85 + 0.15 * Math.sin(p.pulse * 1.3));
    const heartScale = p.isHeart ? 1 + 0.06 * Math.sin(Date.now() * 0.002) : 1;
    const px = cx + Math.cos(p.angle) * p.dist * heartScale;
    const py = cy + Math.sin(p.angle) * p.dist * heartScale;

    if (pSize > 1) {
      const grad = ctx.createRadialGradient(px, py, 0, px, py, pSize * 2.5);
      grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${pAlpha * 0.6})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, pSize * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${pAlpha})`;
    ctx.fill();
  });
}

/* Burst */
let burstParticles = [];
function triggerExplosion() {
  isExplosion   = true;
  explosionTimer = 120;
  speedMultiplier = 3;
  burstParticles  = [];
  for (let i = 0; i < 180; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd   = 1.5 + Math.random() * 4.5;
    burstParticles.push({
      x: cx, y: cy,
      vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd,
      life: 1, decay: 0.012 + Math.random()*0.018,
      size: Math.random()*3+1,
      isHeart: Math.random() > 0.5,
    });
  }
}

function drawBurst() {
  burstParticles = burstParticles.filter(b => b.life > 0);
  burstParticles.forEach(b => {
    b.x += b.vx; b.y += b.vy; b.vy += 0.04; b.life -= b.decay;
    const a = Math.max(0, b.life);
    if (b.isHeart) {
      ctx.font = `${b.size*5}px serif`;
      ctx.globalAlpha = a;
      ctx.fillText("❤️", b.x, b.y);
      ctx.globalAlpha = 1;
    } else {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,${Math.floor(50+Math.random()*130)},${Math.floor(80+Math.random()*80)},${a})`;
      ctx.fill();
    }
  });
}

/* ─────────────────────────────
   3. FLOATING HEARTS
────────────────────────────── */
function spawnFloatingHeart() {
  const container = document.getElementById("heartsContainer");
  const hearts = ["❤️","💕","💖","💗","💓","🌹","✨"];
  const count  = 5 + Math.floor(Math.random() * 6);
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "floating-heart";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left   = (20 + Math.random() * 60) + "%";
    el.style.bottom = "45%";
    el.style.fontSize = (0.8 + Math.random() * 1) + "rem";
    el.style.animationDuration = (2.5 + Math.random() * 2) + "s";
    el.style.animationDelay    = (Math.random() * 0.8) + "s";
    container.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

/* ─────────────────────────────
   4. FLOATING MESSAGES
────────────────────────────── */
function initFloatingMessages() {
  const container = document.getElementById("floatingMessages");
  container.innerHTML = "";
  const isMobile = window.innerWidth < 600;

  mensajesFlotantes.forEach((msg, i) => {
    const el = document.createElement("div");
    el.className    = "float-msg";
    el.textContent  = msg;
    const radius    = (isMobile ? 120 + i*28 : 160 + i*38) + "px";
    const startAngle = (i / mensajesFlotantes.length) * 360;
    el.style.setProperty("--radius", radius);
    el.style.setProperty("--start-angle", startAngle + "deg");
    el.style.left   = "50%";
    el.style.top    = "50%";
    el.style.animationDuration = (14 + i * 2.5) + "s";
    el.style.animationDelay    = (i * 1.4) + "s";
    container.appendChild(el);
  });
}

/* ─────────────────────────────
   5. ORBITAL PHOTOS — JS puro
────────────────────────────── */
let photoElements = [];

function initPhotos() {
  const container = document.getElementById("photosOrbit");
  container.innerHTML = "";
  photoElements = [];

  const isMobile  = window.innerWidth < 600;
  const photoSize = isMobile ? 72 : 100;
  const half      = photoSize / 2;

  /* Radio base + escalado para que cada foto tenga su propio carril */
  const baseRadius = isMobile
    ? Math.min(W, H) * 0.30
    : Math.min(W, H) * 0.34;
  const step = isMobile ? 24 : 32;

  fotos.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Recuerdo ${i + 1}`;

    Object.assign(img.style, {
      position:     "absolute",
      width:        photoSize + "px",
      height:       photoSize + "px",
      borderRadius: "50%",
      objectFit:    "cover",
      border:       "2.5px solid rgba(255,71,109,0.75)",
      boxShadow:    "0 0 14px #ff4d6d, 0 0 30px rgba(255,23,68,0.35)",
      cursor:       "pointer",
      transition:   "box-shadow 0.25s",
      willChange:   "left, top",
      zIndex:       "4",
      pointerEvents: "all",
    });

    img.onerror = () => {
      img.style.background = `radial-gradient(circle at 40% 40%,
        rgba(${120 + i*20},0,${20 + i*12},0.9), rgba(10,0,5,0.95))`;
    };
    img.addEventListener("mouseenter", () => {
      img.style.boxShadow = "0 0 28px #ff1744, 0 0 60px rgba(255,23,68,0.6)";
    });
    img.addEventListener("mouseleave", () => {
      img.style.boxShadow = "0 0 14px #ff4d6d, 0 0 30px rgba(255,23,68,0.35)";
    });
    img.addEventListener("click",      () => openPhotoModal(src, i));

    container.appendChild(img);

    photoElements.push({
      el:     img,
      angle:  (i / fotos.length) * Math.PI * 2,  // separación inicial uniforme
      speed:  0.00055 + i * 0.000045,             // velocidad ligeramente distinta por foto
      radius: baseRadius + i * step,
      half,
    });
  });
}

/* Actualizar posición de cada foto en el loop */
function updatePhotos() {
  photoElements.forEach(p => {
    p.angle += p.speed;
    const x = cx + Math.cos(p.angle) * p.radius - p.half;
    const y = cy + Math.sin(p.angle) * p.radius - p.half;
    p.el.style.left = x + "px";
    p.el.style.top  = y + "px";
  });
}

/* ─────────────────────────────
   6. MAIN ANIMATION LOOP
────────────────────────────── */
let frameCount = 0;

function animate() {
  requestAnimationFrame(animate);
  frameCount++;

  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
  bg.addColorStop(0,   "rgba(15,0,5,1)");
  bg.addColorStop(0.5, "rgba(5,0,2,1)");
  bg.addColorStop(1,   "rgba(0,0,0,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawNebula();
  drawStars();
  drawParticles();
  drawBurst();
  updatePhotos();

  if (explosionTimer > 0) {
    explosionTimer--;
    if (explosionTimer <= 0) { isExplosion = false; speedMultiplier = 1; }
  }

  if (frameCount % 120 === 0) spawnFloatingHeart();
  if (frameCount === 30 * 60) showFinalSequence();
}

/* ─────────────────────────────
   7. CENTRAL HEART CLICK
────────────────────────────── */
document.getElementById("centralHeart").addEventListener("click", () => {
  triggerExplosion();
  spawnFloatingHeart();
  spawnFloatingHeart();
  spawnFloatingHeart();
  document.getElementById("heartModal").classList.remove("hidden");
});

function closeHeartModal() {
  document.getElementById("heartModal").classList.add("hidden");
}
document.getElementById("heartModal").addEventListener("click", e => {
  if (e.target === e.currentTarget) closeHeartModal();
});

/* ─────────────────────────────
   8. PHOTO MODAL
────────────────────────────── */
function openPhotoModal(src, index) {
  const modal = document.getElementById("photoModal");
  document.getElementById("photoModalImg").src = src;
  modal.querySelector(".photo-dedication").textContent =
    dedicatorias[index % dedicatorias.length];
  modal.classList.remove("hidden");
}
function closePhotoModal() {
  document.getElementById("photoModal").classList.add("hidden");
}

/* ─────────────────────────────
   9. CARTA
────────────────────────────── */
function openCarta() {
  document.getElementById("cartaNombre").textContent = nombre;
  document.getElementById("cartaBody").textContent   = carta;
  document.getElementById("cartaModal").classList.remove("hidden");
}
function closeCarta() {
  document.getElementById("cartaModal").classList.add("hidden");
}
document.getElementById("cartaModal").addEventListener("click", e => {
  if (e.target.classList.contains("carta-overlay")) closeCarta();
});

/* ─────────────────────────────
   10. MÚSICA
────────────────────────────── */
const audio = document.getElementById("bgMusic");
let musicPlaying = false;

function toggleMusic() {
  const btn = document.getElementById("btnMusic");
  if (musicPlaying) {
    audio.pause();
    btn.textContent = "🎵 Nuestra Canción";
    musicPlaying = false;
  } else {
    audio.play().catch(() => {});
    btn.textContent = "⏸ Pausar";
    musicPlaying = true;
  }
}
function setVolume(v) { audio.volume = parseFloat(v); }

window.addEventListener("click", () => {
  if (!musicPlaying) {
    audio.volume = document.getElementById("volumeSlider").value;
    audio.play().then(() => {
      musicPlaying = true;
      document.getElementById("btnMusic").textContent = "⏸ Pausar";
    }).catch(() => {});
  }
}, { once: true });

/* ─────────────────────────────
   11. FINAL SEQUENCE
────────────────────────────── */
function showFinalSequence() {
  const seq = document.getElementById("finalSequence");
  seq.classList.remove("hidden");
  speedMultiplier = 2;
  document.querySelectorAll(".orbit-photo").forEach(img => {
    img.style.boxShadow = "0 0 40px #ff1744, 0 0 80px rgba(255,23,68,0.5)";
  });
  document.querySelector(".heart-pulse").style.animationDuration = "0.6s";
  setTimeout(() => { seq.classList.add("hidden"); speedMultiplier = 1; }, 9000);
}

/* ─────────────────────────────
   12. RESIZE
────────────────────────────── */
window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
  initPhotos();
  initFloatingMessages();
});

/* ─────────────────────────────
   13. BOOT
────────────────────────────── */
initParticles();
initFloatingMessages();
initPhotos();
animate();

/* Globals para onclick en HTML */
window.closeHeartModal = closeHeartModal;
window.closePhotoModal = closePhotoModal;
window.openCarta       = openCarta;
window.closeCarta      = closeCarta;
window.toggleMusic     = toggleMusic;
window.setVolume       = setVolume;