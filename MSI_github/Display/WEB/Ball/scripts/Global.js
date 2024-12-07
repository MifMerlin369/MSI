//global vars i guess
let entities = [],
  timers = [],
  bounce = 0.987,
  Global = {},
  Time = {
    time: 0,
    delta: 0,
    fps: 1000 / 60,
    lastTimestamp: 0
  },
  distance = function(x1, y1, x2, y2) {
    let dx = x2 - x1,
      dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  },
  createEnt = function(config) {
    let ent = new Ent(config)
    entities.push(ent)
    ent.id = entities.length - 1
    return ent
  },
  clamp = function(min, max, v) {
    if (min > v) {
      return min
    } else if (v > max) {
      return max
    } else {
      return v
    }
  },
  degTorad = Math.PI / 180,
  radTodeg = 180 / Math.PI

const clone = obj => {
  if (obj === null || typeof(obj) !== 'object') return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr];
    }
  };
  return copy;
}

function logs() {
  for (let i of arguments) {
    console.log(i)
  }
};