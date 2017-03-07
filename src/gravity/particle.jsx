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
    this.particle = null
  }

  put(svg) {
    this.particle = svg.append("circle")
                       .attr("r", this.r)
                       .attr("cx", this.x)
                       .attr("cy", this.y)
                       .attr("fill", "transparent")
                       .attr("id", this.id)
                       .attr("stroke", this.color)
                       .attr("stroke-width", this.sw)
    this.particle
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

  secretPenisSvg() {
    const penis = "M61.363,52.535c-1.308,0-2.604,0.139-3.876,0.416l-0.199-42.186l0,0C56.264,4.903,51.15,0.43,45,0.43   S33.735,4.903,32.711,10.765l0,0l-0.199,42.186c-1.273-0.277-2.569-0.416-3.876-0.416c-10.21,0-18.517,8.309-18.517,18.518   c0,10.211,8.306,18.518,18.517,18.518c7.083,0,13.251-3.998,16.364-9.855c3.113,5.857,9.28,9.855,16.364,9.855   c10.209,0,18.517-8.307,18.517-18.518C79.88,60.844,71.572,52.535,61.363,52.535z M52.889,10.765h-5.736V5.033   C49.934,5.794,52.128,7.985,52.889,10.765z M42.846,5.033v5.732h-5.737C37.871,7.985,40.065,5.794,42.846,5.033z"
  }
}
