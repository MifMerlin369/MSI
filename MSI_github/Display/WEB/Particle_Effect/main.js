let [w, h] = [window.innerWidth, window.innerHeight];
[canvas.width, canvas.height] = [w, h];
const ctx = canvas.getContext('2d');

function random(from, to) {
  return Math.floor(Math.random() * (from - to) + to);
}

function rand(from, to) {
  return Math.random() * (from - to) + to;
}

function distance(x1, y1, x2, y2) {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a * a + b * b);
}

const time = () => performance.now();

let fps = 30;
let fpsc = 0;
let lastT = time();
let rtime = 0,
  ctime = 0,
  stime = 0;

const ps = [];
const gravity = .1;
const airF = 0.6;
const wind = 0;
const color = '#fff';
const trackedColor = '#0ff';
const bg = '#000';
const radius = 3;
const radius2 = 7;
const maxDist = 15;
const maxSpeed = 10;
const renderR = 7;
const highGraphics = true;
const fpsOptim = !false;
let acount = 2;
let atime = 100;

/*ctx.scale(0.7, 0.7);
ctx.translate(w * 0.2, h * 0.2);*/

class Particle {
  constructor(tracked = false) {
    this.x = random(0, w);
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.color = tracked ? trackedColor : color;
    this.tracked = tracked;
  }

  tick() {
    const start = time();

    this.x += this.vx;
    this.y += this.vy;

    this.vy += gravity + rand(0, 1);
    this.vx += rand(0, 2) - 1;
    if (Math.abs(this.vx) > wind) this.vx += wind;

    this.distTick();

    this.vy *= airF;
    this.vx *= airF;

    if (this.vx > maxSpeed) this.vx = maxSpeed;
    if (this.vy > maxSpeed) this.vy = maxSpeed;

    ctime += time() - start;
  }

  distTick() {
    const self = this;
    ps.forEach(p => {
      const dist = distance(self.x, self.y, p.x, p.y);
      const dm = Math.min(Math.max(1, maxDist / Math.min(maxDist, dist) * 0.125), 2);
      if (dist < maxDist && dist > 0) {
        this.vx *= dm;
        this.vy *= dm;
      }
      if (dist < 10) {
        this.vx += rand(0, 2) - 1;
        this.vy *= 1.1;
      }
    });
  }

  draw() {
    const start = time();
    if (this.tracked) {
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
    if (this.x > w + radius2 ||
      this.x < -radius2) {
      rtime += time() - start;
      return;
    }
    if (highGraphics) {
      const gradient = ctx.createRadialGradient(this.x, this.y, radius, this.x, this.y, radius2);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(0.1, '#fff4');
      gradient.addColorStop(1, '#fff0');
      ctx.fillStyle = gradient;
      ctx.fillRect(this.x - renderR, this.y - renderR, renderR * 2, renderR * 2);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    rtime += time() - start;
  }
}

function draw() {
  const start = time();
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  rtime += time() - start;

  ps.forEach((p, i) => {
    p.tick();
    p.draw();

    const start = time();
    if (p.y > h + radius2) ps.splice(i, 1);
    if (p.x > w + 20) ps.splice(i, 1);
    if (p.x < -20) ps.splice(i, 1);
    ctime += time() - start;
  });

  const t = time();

  ctx.fillStyle = '#000b';
  ctx.fillRect(0, 0, 120, 130);
  ctx.fillStyle = '#fff';
  ctx.font = '15px Arial';
  ctx.fillText(fps + ' FPS', 10, 20);
  ctx.fillText(ps.length + ' Particles', 10, 35);
  ctx.fillText((t - lastT).toFixed(1) + ' Frametime', 10, 50);
  ctx.fillText(stime.toFixed(1) + ' System', 10, 65);
  ctx.fillStyle = '#00f';
  ctx.fillText(rtime.toFixed(1) + ' Render', 10, 80);
  ctx.fillStyle = '#0f0';
  ctx.fillText(ctime.toFixed(1) + ' Calc', 10, 95);

  ctx.fillStyle = '#00f';
  ctx.fillRect(10, 110, 100, 10);

  const sum = (ctime / rtime) + (rtime / ctime);
  ctx.fillStyle = '#0f0';
  ctx.fillRect(10, 110, 100 / sum * (ctime / rtime), 10);

  /*ctx.fillStyle = '#00f';
  const v = Math.min(100 / sum * (rtime / ctime));
  ctx.fillRect(10 + (100 - v), 110, v, 10);*/

  stime = time() - t;
  ctime = rtime = 0;
  fpsc++;
  lastT = t;

  requestAnimationFrame(draw);
}

function addp() {
  const start = time();
  for (let i = 0; i < acount; i++) {
    ps.push(new Particle());
  }

  if (fpsOptim) {
    if (fps > 50) {
      atime = 10;
      acount = 5;
    } else if (fps < 10) {
      acount = 1;
      atime = 1000;
      ps.splice(rand(0, ps.length - 1), 1);
    } else if (fps < 20) {
      acount = 1;
      atime = 500;
      ps.splice(rand(0, ps.length - 1), 1);
    } else if (fps < 30) {
      acount = 2;
      atime = 50;
    } else if (fps < 40) {
      acount = 2;
      atime = 30;
    } else if (fps < 50) {
      acount = 3;
      atime = 30;
    }
  }

  setTimeout(addp, atime);
  ctime += time() - start;
}

setTimeout(addp, atime);

setInterval(() => {
  fps = fpsc;
  fpsc = 0;
}, 1000);

document.addEventListener('click', e => {
  const p = new Particle(true);
  p.x = e.clientX;
  p.y = e.clientY;
  ps.push(p);
});

requestAnimationFrame(draw);