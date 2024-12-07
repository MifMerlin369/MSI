class Head extends Ball {
  constructor({
    bodyCount = 50,
    segmentOffset = 15,
    segmentType = new Ball(),
    color = "#D54949"
  } = {}) {
    super(...arguments)
    this.bodyCount = bodyCount
    this.segmentOffset = segmentOffset
    this.segmentType = segmentType
    this.color = color
  }
  init(ent) {
    ent.data = {
      segments: [],
      //timer: new Timer(30),
    }
    let vel = ent.velocity
    vel.setLength(10)
    vel.setAngle((Math.random() * 360) * degTorad)
    super.init(ent)
  }
  createSegments(ent) {
    let seg = ent.data.segments
    let Tmp = new Vec() //temporary vec
    for (let i = 0; i < this.bodyCount; i++) {
      let lseg = seg[i - 1] ? seg[i - 1] : ent
      let angle = ent.velocity.getAngle() * radTodeg
      Tmp.trns(this.segmentOffset, angle + 180).addv(lseg.position)
      this.addSegment(seg, this.segmentType, Tmp)
    }
  }
  segmentMove(ent) {
    //a bit jittery
    let seg = ent.data.segments
    // loop through each position
    for (let i = 0; i < seg.length; i++) {
      // get last and current position
      const last = seg[i - 1] ? seg[i - 1] : ent
      const curr = seg[i]

      // get difference in x and y of each position
      let angle = last.angleTo(curr);
      // get the new x and new y using polar coordinate
      const nx = this.segmentOffset * Math.cos(angle);
      const ny = this.segmentOffset * Math.sin(angle);
      // add the new x and new y to the last snake's position to "join" the two together without a gap
      curr.setPos(nx + last.position.x, ny + last.position.y)
    }
  }
  addSegment(segments, segmentType, lseg) {
    let nseg = segmentType.create({
      color: (Math.random() * 10 > 5) ? "#D54949" : "#4990D5" //random color
    });
    nseg.setPosv(lseg)
    segments.push(nseg)
  }
  removeSegment(ent, index) {
    let seg = ent.data.segments[index]
    if (seg) seg.remove();
  }
  update(ent) {
    let segments = ent.data.segments,
      filtered = segments.filter(seg => seg != null && !seg.removed)
    //check if segments are removed and remove it
    if (filtered.length != segments.length) ent.data.segments = filtered

    /*ent.data.timer.func = () => {
      this.removeSegment(ent, 2)
    }*/
    this.segmentMove(ent)
    super.update(ent)
  }
  create(config) {
    let ent = new Ent(Object.assign({
      type: this
    }, config))
    this.createSegments(ent)
    return ent
  }
}