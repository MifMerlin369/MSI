const canvas = document.querySelector("canvas"),
  width = canvas.width,
  height = canvas.height,
  context = canvas.getContext("2d"),
  voronoi = d3.voronoi().extent([[0.5, 0.5], [width - 0.5, height - 0.5]]);

const n = 100,
  particles = Array.from(new Array(n), getInitData);

let cells,
  activeCell;

d3.select(canvas)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged));

d3.timer(function(elapsed) {
  newData()
  drawVoronoi()
});


function newData() {
  for (let p of particles) {
    p[0] += p.vx;
    if (p[0] < 0) p[0] = p.vx *= -1;
    else if (p[0] > width) p[0] = width + (p.vx *= -1);

    p[1] += p.vy;
    if (p[1] < 0) p[1] = p.vy *= -1;
    else if (p[1] > height) p[1] = height + (p.vy *= -1);

    p.vx += 0.1 * (Math.random() - .5) - 0.01 * p.vx;
    p.vy += 0.1 * (Math.random() - .5) - 0.01 * p.vy;
  }
}

function drawVoronoi() {
  cells = voronoi(particles);
  context.clearRect(0, 0, width, height);

  cells.polygons().forEach(function(cell, i) { drawPolygonIncircle(cell, i); });

  context.beginPath();
  cells.polygons().forEach(function(cell) { drawPolygon(cell); });
  context.lineWidth = 1;
  context.strokeStyle = "#aaa";
  context.stroke();

  context.beginPath();
  particles.forEach(function(particle) { drawPoint(particle); });
  context.fillStyle = "#000";
  context.fill();
}

function drawPoint(point) {
  context.moveTo(point[0] + 1.5, point[1]);
  context.arc(point[0], point[1], 1.5, 0, 2 * Math.PI);
}

function drawPolygon(points) {
  points.map(function(d, i) { context[i === 0 ? "moveTo" : "lineTo"](d[0], d[1]) })
  context.closePath();
}

function drawPolygonIncircle(points, i) {
  const circle = polygonIncircle(points),
    radius = circle.radius - 2.5;
  if (radius > 0) {
    context.beginPath();
    context.moveTo(circle[0] + radius, circle[1]);
    context.fillStyle = i === activeCell ? "#f88" : "#ddd";
    context.arc(circle[0], circle[1], radius, 0, 2 * Math.PI);
    context.fill();
  }
}

function getInitData() {
  return { 0: Math.random() * width, 1: Math.random() * height, vx: 0, vy: 0 }
}

function dragstarted(d) {
  activeCell = cells.find(d3.event.x, d3.event.y).index
  particles[activeCell][0] = d3.event.x
  particles[activeCell][1] = d3.event.y
  drawVoronoi()
}

function dragged(d) {
  activeCell = cells.find(d3.event.x, d3.event.y).index
  particles[activeCell][0] = d3.event.x
  particles[activeCell][1] = d3.event.y
  drawVoronoi()
}



// A horrible brute-force algorithm for determining the largest circle that can
// fit inside a convex polygon. For each distinct set of three sides of the
// polygon, compute the tangent circle. Then reduce the circle’s radius against
// the remaining sides of the polygon.
function polygonIncircle(points) {
  var circle = { radius: 0 };

  for (var i = 0, n = points.length; i < n; ++i) {
    var pi0 = points[i],
      pi1 = points[(i + 1) % n];
    for (var j = i + 1; j < n; ++j) {
      var pj0 = points[j],
        pj1 = points[(j + 1) % n],
        pij = j === i + 1 ? pj0 : lineLineIntersection(pi0[0], pi0[1], pi1[0], pi1[1], pj0[0], pj0[1], pj1[0], pj1[1]);
      search: for (var k = j + 1; k < n; ++k) {
        var pk0 = points[k],
          pk1 = points[(k + 1) % n],
          pik = lineLineIntersection(pi0[0], pi0[1], pi1[0], pi1[1], pk0[0], pk0[1], pk1[0], pk1[1]),
          pjk = k === j + 1 ? pk0 : lineLineIntersection(pj0[0], pj0[1], pj1[0], pj1[1], pk0[0], pk0[1], pk1[0], pk1[1]),
          candidate = triangleIncircle(pij[0], pij[1], pik[0], pik[1], pjk[0], pjk[1]),
          radius = candidate.radius;

        for (var l = 0; l < n; ++l) {
          var pl0 = points[l],
            pl1 = points[(l + 1) % n],
            r = pointLineDistance(candidate[0], candidate[1], pl0[0], pl0[1], pl1[0], pl1[1]);
          if (r < circle.radius) continue search;
          if (r < radius) radius = r;
        }

        circle = candidate;
        circle.radius = radius;
      }
    }
  }

  return circle;
}

// Returns the incircle of the triangle 012.
function triangleIncircle(x0, y0, x1, y1, x2, y2) {
  var x01 = x0 - x1,
    y01 = y0 - y1,
    x02 = x0 - x2,
    y02 = y0 - y2,
    x12 = x1 - x2,
    y12 = y1 - y2,
    l01 = Math.sqrt(x01 * x01 + y01 * y01),
    l02 = Math.sqrt(x02 * x02 + y02 * y02),
    l12 = Math.sqrt(x12 * x12 + y12 * y12),
    k0 = l01 / (l01 + l02),
    k1 = l12 / (l12 + l01),
    center = lineLineIntersection(x0, y0, x1 - k0 * x12, y1 - k0 * y12, x1, y1, x2 + k1 * x02, y2 + k1 * y02);
  center.radius = Math.sqrt((l02 + l12 - l01) * (l12 + l01 - l02) * (l01 + l02 - l12) / (l01 + l02 + l12)) / 2;
  return center;
}

// Returns the intersection of the infinite lines 01 and 23.
function lineLineIntersection(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x02 = x0 - x2,
    y02 = y0 - y2,
    x10 = x1 - x0,
    y10 = y1 - y0,
    x32 = x3 - x2,
    y32 = y3 - y2,
    t = (x32 * y02 - y32 * x02) / (y32 * x10 - x32 * y10);
  return [x0 + t * x10, y0 + t * y10];
}

// Returns the signed distance from point 0 to the infinite line 12.
function pointLineDistance(x0, y0, x1, y1, x2, y2) {
  var x21 = x2 - x1,
    y21 = y2 - y1;
  return (y21 * x0 - x21 * y0 + x2 * y1 - y2 * x1) / Math.sqrt(y21 * y21 + x21 * x21);
}