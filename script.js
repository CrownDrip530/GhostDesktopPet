const ghost = document.getElementById("ghost-container");
const hat = document.getElementById("hat");

let x = 200;
let y = 200;

let vx = 0;
let vy = 0;

let t = 0;

let dragging = false;
let offsetX = 0;
let offsetY = 0;

/* =========================
   ANIMATION LOOP
========================= */
function animate() {
  t += 0.02;

  if (!dragging) {
    // soft floating motion
    vy += Math.sin(t) * 0.15;

    x += vx;
    y += vy;

    // damping (smooth slowdown)
    vx *= 0.92;
    vy *= 0.92;
  }

  ghost.style.left = x + "px";
  ghost.style.top = y + "px";

  // hat “lag wobble” effect
  hat.style.transform =
    `translate(${Math.sin(t * 3) * 2}px, ${Math.cos(t * 2) * 2}px)`;

  requestAnimationFrame(animate);
}

animate();

/* =========================
   DRAG SYSTEM
========================= */
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
  }
});
