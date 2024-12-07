class Draw {
  static circle(x, y, radius, ctx = Global.ctx) {
    ctx.beginPath()
    ctx.arc(Math.floor(x), Math.floor(y), Math.floor(radius), 0, Math.PI * 2)
    ctx.fill()
  }
  static lineRect(x, y, width, height, center = false, ctx = Global.ctx) {
    let cx = (center) ? x - (width / 2) : x
    let cy = (center) ? y - (height / 2) : y
    ctx.beginPath()
    ctx.strokeRect(Math.floor(cx), Math.floor(cy), width, height)
    ctx.stroke()
  }
  static line(x1, y1, x2, y2, width, ctx = Global.ctx) {
    ctx.beginPath();
    ctx.moveTo(Math.floor(x1), Math.floor(y1));
    ctx.lineTo(Math.floor(x2), Math.floor(y2));
    ctx.lineWidth = width;
    ctx.stroke();
  }
}