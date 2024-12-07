window.onload = function() {
  let canvas = document.getElementById("canvas"),
    ctx = Global.ctx = canvas.getContext("2d"),
    width = canvas.width = Global.width = window.innerWidth,
    height = canvas.height = Global.height = window.innerHeight;

  let asdf = new Head();
  asdf.create({
    x: width / 2,
    y: height / 2
  })
  asdf.create({
    x: width / 2,
    y: height / 2
  })

  function constraint(x, start, end, vel, axis) {
    if (x > end) { vel[axis] *= -bounce; return end }
    if (x < start) { vel[axis] *= -bounce; return start }
    return x
  }

  function lock(e) {
    let pos = e.position,
      vel = e.velocity
    pos.x = constraint(pos.x, 0, width, vel, "x")
    pos.y = constraint(pos.y, 0, height, vel, "y")
  }

  requestAnimationFrame(update);

  function update(time) {
    Time.time = time;
    if (!Time.lastTimestamp) Time.lastTimestamp = time
    let elapsed = time - Time.lastTimestamp;
    Time.delta = elapsed / Time.fps

    if (elapsed > Time.fps) {
      ctx.clearRect(0, 0, width, height);

      let filtered = entities.filter(e => e != null && !e.removed)
      if (filtered.length != entities.length) entities = filtered

      timers.forEach(t => t.update())
      entities.forEach((e) => {
        if (e.type instanceof Head) e.velocity.setLength(10)

        let pos = e.position
        lock(e)
        e.update()
        //outline
        ctx.fillStyle = "#000000"
        Draw.circle(pos.x, pos.y, e.type.radius * 1.4, ctx)
      });
      //drawn last to first
      for (let i = entities.length - 1; i >= 0; i--) {
        entities[i].render(ctx)
      }
      Time.lastTimestamp = time
    }
    requestAnimationFrame(update);
  }
}