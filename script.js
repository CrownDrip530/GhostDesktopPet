const ghost = document.getElementById("ghost-container");
const hat = document.getElementById("hat");
const eyes = document.getElementById("eyes");
const pop = document.getElementById("pop");

/* ======================
   GHOST PHYSICS
====================== */
let x = 200;
let y = 200;

let vx = 0;
let vy = 0;

let t = 0;
let idleTime = 0;
let state = "idle";

/* ======================
   HAT PHYSICS (SPRING)
====================== */
// hat position offset
let hatX = 0;
let hatY = 0;

// hat velocity (spring movement)
let hatVX = 0;
let hatVY = 0;

/* ======================
   DRAG STATE
====================== */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

/* ======================
   BLINK SYSTEM
====================== */
function blink() {
  eyes.style.opacity = "0";
  setTimeout(() => eyes.style.opacity = "1", 150);
}

setInterval(() => {
  if (!dragging && Math.random() < 0.4) blink();
}, 2000);

/* ======================
   MAIN LOOP
====================== */
function animate() {
  t += 0.02;
  idleTime++;

  /* ======================
     AI BEHAVIOR
  ====================== */
  if (!dragging) {

    if (idleTime > 300) {
      const r = Math.random();
      state = r < 0.5 ? "idle" : r < 0.8 ? "wander" : "sleep";
      idleTime = 0;
    }

    if (state === "wander") {
      vx += (Math.random() - 0.5) * 0.3;
      vy += (Math.random() - 0.5) * 0.3;
    }

    if (state === "sleep") {
      vx *= 0.9;
      vy *= 0.9;
      eyes.innerHTML = "— —";
    } else {
      eyes.innerHTML = "• •";
    }

    // floating motion
    vy += Math.sin(t) * 0.15;

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
     APPLY GHOST POSITION
  ====================== */
  ghost.style.left = x + "px";
  ghost.style.top = y + "px";

  /* ======================
     🎩 HAT SPRING PHYSICS
     (this is the magic)
  ====================== */

  // target = ghost movement + slight wobble
  let targetX = Math.sin(t * 2) * 2;
  let targetY = Math.cos(t * 2) * 2;

  // spring force (follow target)
  let stiffness = 0.15;   // pull strength
  let damping = 0.75;     // resistance

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

document.addEventListener("mousemove", (e) => {
  if (dragging) {
    x = e.clientX - offsetX;
    y = e.clientY - offsetY;

    vx = e.movementX;
    vy = e.movementY;

    // hat reacts to dragging (little lag spike)
    hatVX += vx * 0.05;
    hatVY += vy * 0.05;
  }
});

/* ======================
   SOUND REACTION
====================== */
ghost.addEventListener("click", () => {
  pop.currentTime = 0;
  pop.play();

  vx += (Math.random() - 0.5) * 8;
  vy -= 5;
});
