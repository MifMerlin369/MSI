class Timer {
  constructor(resetTime) {
    this.time = 0
    this.resetTime = resetTime || 60
    this.func = () => {}
    timers.push(this)
  }
  update() {
    this.time += Time.delta
    if (this.time >= this.resetTime) {
      this.func()
      this.time = 0
    }
  }
}