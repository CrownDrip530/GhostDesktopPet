const ghost = document.getElementById("ghost-container");
const hat = document.getElementById("hat");
const eyes = document.getElementById("eyes");
const pop = document.getElementById("pop");

/* ======================
   POSITION + PHYSICS
====================== */
let x = 200;
let y = 200;

let vx = 0;
let vy = 0;

/* ======================
   MOUSE + MODES
====================== */
let mouseX = x;
let mouseY = y;
let lastMoveTime = Date.now();
let mode = "idle";

/* ======================
   HAT SPRING PHYSICS
====================== */
let hatX = 0;
let hatY = 0;
let hatVX = 0;
let hatVY = 0;

/* ======================
   STATE
====================== */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

let t = 0;

/* ======================
   MOUSE TRACKING
====================== */
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  lastMoveTime = Date.now();

  if (dragging) {
    x = e.clientX - offsetX;
    y = e.clientY - offsetY;

    vx = e.movementX;
    vy = e.movementY;

    hatVX += vx * 0.05;
    hatVY += vy * 0.05;
  }
});

/* ======================
   BLINKING
====================== */
function blink() {
  eyes.style.opacity = "0";
  setTimeout(() => eyes.style.opacity = "1", 120);
}

setInterval(() => {
  if (!dragging && Math.random() < 0.4) blink();
}, 2000);

/* ======================
   ATTENTION BURST
====================== */
function attentionBurst() {
  vx += (Math.random() - 0.5) * 10;
  vy -= Math.random() * 6;
}

setInterval(() => {
  if (mode === "attention" && !dragging) {
    attentionBurst();
  }
}, 1200);

/* ======================
   MAIN LOOP
====================== */
function animate() {
  t += 0.02;

  let idleTime = Date.now() - lastMoveTime;

  /* ======================
     MODE SYSTEM
  ====================== */
  if (idleTime < 2000) {
    mode = "chase";
  } else if (idleTime < 6000) {
    mode = "idle";
  } else {
    mode = "attention";
  }

  /* ======================
     AI BEHAVIOR
  ====================== */
  if (!dragging) {

    if (mode === "chase") {
      vx += (mouseX - x) * 0.002;
      vy += (mouseY - y) * 0.002;
      eyes.innerHTML = "• •";
    }

    if (mode === "attention") {
      vx += (Math.random() - 0.5) * 0.5;
      vy += (Math.random() - 0.5) * 0.5;
      eyes.innerHTML = "!! !!";
    }

    if (mode === "idle") {
      vx += Math.sin(t) * 0.1;
      vy += Math.cos(t) * 0.1;
      eyes.innerHTML = "• •";
    }

    if (idleTime > 10000) {
      eyes.innerHTML = "— —"; // sleep
    }

    x += vx;
    y += vy;

    vx *= 0.92;
    vy *= 0.92;
  }

  /* ======================
     SCREEN BOUNDS
  ====================== */
  const maxX = window.innerWidth - 120;
  const maxY = window.innerHeight - 120;

  if (x < 0) { x = 0; vx *= -0.6; }
  if (x > maxX) { x = maxX; vx *= -0.6; }

  if (y < 0) { y = 0; vy *= -0.6; }
  if (y > maxY) { y = maxY; vy *= -0.6; }

  /* ======================
     APPLY POSITION
  ====================== */
  ghost.style.left = x + "px";
  ghost.style.top = y + "px";

  /* ======================
     HAT SPRING PHYSICS
  ====================== */
  let targetX = Math.sin(t * 2) * 2;
  let targetY = Math.cos(t * 2) * 2;

  const stiffness = 0.15;
  const damping = 0.75;

  hatVX += (targetX - hatX) * stiffness;
  hatVY += (targetY - hatY) * stiffness;

  hatVX *= damping;
  hatVY *= damping;

  hatX += hatVX;
  hatY += hatVY;

  hat.style.transform =
    `translate(${hatX}px, ${hatY}px)`;

  requestAnimationFrame(animate);
}

animate();

/* ======================
   DRAG SYSTEM
====================== */
ghost.addEventListener("mousedown", (e) => {
  dragging = true;
  offsetX = e.clientX - x;
  offsetY = e.clientY - y;
  ghost.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
  dragging = false;
  ghost.style.cursor = "grab";
});

/* ======================
   SOUND + CLICK
====================== */
ghost.addEventListener("click", () => {
  pop.currentTime = 0;
  pop.play();

  vx += (Math.random() - 0.5) * 8;
  vy -= 5;
});
