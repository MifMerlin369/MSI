/*
 * @author Zeniku
 */
class Ball {
  constructor({
    radius = 20,
    color = "#4990D5"
  } = {}) {
    this.radius = radius
    this.color = color
  }
  init(ent) {
    //empty
  }
  update(ent) {
    //empty
  }
  render(ent, con) {
    con.fillStyle = ent.color
    Draw.circle(ent.position.x, ent.position.y, this.radius, con)
  }
  create(config) {
    let ent = new Ent(Object.assign({
      type: this
    }, config))
    return ent
  }
}