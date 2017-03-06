const d3 = require('d3')

export class Particle {
  constructor(data) {
    // INSTANCE VARIABLES
    this.id = data.id
    this.r  = data.r
    this.x = data.x
    this.y = data.y

    // CLASS VARIABLES
    this.sw = data.sw
    this.color = data.color
    this.classId = data.classId

    // WORLD VARIABLES
    this.w  = data.w
    this.h  = data.h
    this.M  = data.M
    this.at = data.at
    this.distMin = data.distMin
    this.distMax = data.distMax

    // STANDARD VARIABLES
    this.xv = 0
    this.yv = 0
    this.group = null
    this.particle = null
  }

  put(svg) {
    this.group = svg.append("g")
    this.particle = this.group
                        .append("circle")
                        .attr("r", this.r)
                        .attr("cx", this.x)
                        .attr("cy", this.y)
                        .attr("fill", "transparent")
                        .attr("id", this.id)
                        .attr("stroke", this.color)
                        .attr("stroke-width", this.sw)
    this.group
        .on("click", () => {this.onClick()})
  }

  onClick() {
    this.xv = 0
    this.yv = 0
  }

  updateAndMove(particles, centroid, matrix, world) {
    this.updateWorld(world)
    this.checkBorders()
    this.checkInteractions(particles, matrix)
    this.addAttrition()
    this.move()
  }

  updateWorld(world) {
    this.w  = world.w
    this.h  = world.h
    this.M  = world.M
    this.at = world.attrition
    this.distMin = world.distMin
    this.distMax = world.distMax
    this.r  = world.particleRadius
    this.sw = world.strokeWidth
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

  checkInteractions(particles, matrix) {
    particles.map( (particle) => {
      if(particle != this){
        const dx = particle.x - this.x
        const dy = particle.y - this.y
        const dist = Math.sqrt( dx ** 2 + dy ** 2 )
        if(dist < this.distMax && dist > this.distMin){
          const angle = Math.atan2(dy, dx)
          const coeff = matrix[this.classId][particle.classId]
          this.xv +=  coeff * (Math.cos(angle) * this.M) / (this.r * dist)
          this.yv +=  coeff * (Math.sin(angle) * this.M) / (this.r * dist)
          // if(dist < this.r + particle.r){
          //   this.x -= this.x < particle.x ? (dist - dx) : -(dist - dx)
          //   this.y -= this.y < particle.y ? (dist - dy) : -(dist - dy)
          //   this.xv += -2 * this.xv
          //   this.yv += -2 * this.yv
          // }
        }
      }
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
