/*
 * @author Zeniku
 */
class Ent {
  constructor(config) {
    this.data = {}
    this.type = config.type
    this.position = new Vec(config.x, config.y)
    this.velocity = new Vec(config.velX, config.velY)
    this.removed = false
    this.color = config.color || config.type.color
    this.init();

    entities.push(this)
    this.id = entities.length - 1
  }
  init() {
    this.type.init(this)
  }
  update() {
    this.velocity.scl(0.997, 0.997) //friction i guess
    this.position.addv(this.velocity)
    this.type.update(this)
  }
  rotation() {
    return Math.atan2(this.y, this.x);
  }
  accel(x, y) {
    this.velocity.add(x, y)
  }
  render(con) {
    this.type.render(this, con);
  }
  setPos(x, y) {
    this.position.setPos(x, y)
    return this
  }
  setPosv(v) {
    return this.setPos(v.x, v.y)
  }
  setVelv(v) {
    return this.setVel(v.x, v.y)
  }
  setVel(x, y) {
    this.velocity.setPos(x, y)
    return this
  }
  remove() {
    this.removed = true
  }
  angleTo(p2) {
    let p2Pos = p2.position,
      pPos = this.position;
    return Math.atan2(p2Pos.y - pPos.y, p2Pos.x - pPos.x);
  }
  distanceTo(p2) {
    let p2Pos = p2.position,
      pPos = this.position;
    return distance(pPos.x, pPos.y, p2Pos.x, p2Pos.y);
  }
}