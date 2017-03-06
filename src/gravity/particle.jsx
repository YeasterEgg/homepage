const d3 = require('d3')

export class Particle {
  constructor(data) {
    this.id = data.id
    this.r  = data.r
    this.sw = data.sw
    this.w  = data.w
    this.h  = data.h
    this.M  = data.M
    this.at = data.at

    this.x = data.x
    this.y = data.y

    this.xv = 0
    this.yv = 0
    this.color = data.color || "black"
    this.classId = data.classId

    this.charge = 1
  }

  put(svg) {
    this.group = svg.append("g")
    this.particle = this.group
                        .append("circle")
                        .attr("r", this.r)
                        .attr("cx", this.x)
                        .attr("cy", this.y)
                        .attr("fill", "transparent")
                        .attr("stroke", this.color)
                        .attr("stroke-width", this.sw)

    this.group.on("click", () => {this.onClick()})
  }

  onClick() {
    this.xv = 0
    this.yv = 0
  }

  updateStatus(centre, sameArray) {
    this.checkCentre(centre)
    this.checkBorders()
    this.addAttrition()
    // this.checkOthers(sameArray)
    this.move()
  }

  checkCentre(centre) {
    const dx = centre.x - this.x
    const dy = centre.y - this.y
    const dist = Math.sqrt( dx ** 2 + dy ** 2 )
    const angle = Math.atan2(dy, dx)
    this.xv +=  (Math.cos(angle) * this.M) / (this.r * dist)
    this.yv +=  (Math.sin(angle) * this.M) / (this.r * dist)
  }

  checkBorders() {
    if(this.x < this.r){
      this.xv += -2 * this.xv
      this.x = this.r
    }else if (this.x > (this.w - this.r)){
      this.xv += -2 * this.xv
      this.x = this.w - this.r
    }

    if(this.y < this.r){
      this.yv += -2 * this.yv
      this.y = this.r
    }else if (this.y > (this.h - this.r)){
      this.yv += -2 * this.yv
      this.y = this.h - this.r
    }
  }

  checkOthers(sameArray) {
    sameArray.map( (particle) => {
      const dx = particle.x - this.x
      const dy = particle.y - this.y
      const dist = Math.sqrt( dx ** 2 + dy ** 2 )
      const angle = Math.atan2(dy, dx)
      this.xv +=  (Math.cos(angle) * this.M) / (this.r * dist)
      this.yv +=  (Math.sin(angle) * this.M) / (this.r * dist)
    })
  }

  addAttrition() {
    this.xv *= this.at
    this.yv *= this.at
  }

  move() {
    this.x += this.xv
    this.y += this.yv
    this.particle
        .attr("cx", this.x)
        .attr("cy", this.y)
  }
}
