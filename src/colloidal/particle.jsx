const d3 = require('d3')

export class Particle {
  constructor(data) {
    // INSTANCE VARIABLES
    this.x = data.x
    this.y = data.y
    this.w = data.w

    // CLASS VARIABLES
    this.color = data.color
    this.classId = data.classId

    // STANDARD VARIABLES
    this.xv = 0
    this.yv = 0
    this.particle = null
    this.group = null
    this.arrow = null
    this.speed = 0
  }

  put(world) {
    this.group = world.svg
                      .append("g")
                      .attr("transform", "translate(" + this.x + "," + this.y + ")")
    this.particle = this.group
                        .append("circle")
                        .attr("r", world.particleRadius)
                        .attr("fill", this.color)
    this.particle
        .on("mouseover", () => {this.onMouseOver(world)})
  }

  redraw(color, classId) {
    this.color = color
    this.particle
        .transition()
        .duration(500)
        .attr("fill", this.color)
    this.classId = classId
  }

  onMouseOver(world) {
    if(!world.running){
      d3.select(".colloidal-particle_speed")
        .text(Math.round(this.speed * 100) / 100 + " [x: " + (Math.round(this.xv * 100) / 100) + ";y: " + (Math.round(this.yv * 100) / 100) + "]")
    }
  }

  updateAndMove(particles, matrix, world, mouseBall) {
    this.checkBorders(world)
    this.checkInteractions(world, particles, matrix)
    this.checkMouse(world, mouseBall)
    this.addAttrition(world)
    this.addRandomTemperature(world)
    this.move(world)
  }

  checkBorders(world) {
    if(this.x < world.particleRadius){
      this.xv += -2 * this.xv
      this.x = world.particleRadius
    }else if (this.x > (world.w - world.particleRadius)){
      this.xv += -2 * this.xv
      this.x = world.w - world.particleRadius
    }

    if(this.y < world.particleRadius){
      this.yv += -2 * this.yv
      this.y = world.particleRadius
    }else if (this.y > (world.h - world.particleRadius)){
      this.yv += -2 * this.yv
      this.y = world.h - world.particleRadius
    }
  }

  checkInteractions(world) {
    world.particles.map( (particle) => {
      if(particle != this){
        const dx = particle.x - this.x
        const dy = particle.y - this.y
        const dist = Math.sqrt( dx ** 2 + dy ** 2 )
        if(dist < world.distMax && dist > world.distMin){
          const angle = Math.atan2(dy, dx)
          const coeff = world.classesMatrix[this.classId][particle.classId]
          this.xv +=  coeff * (Math.cos(angle) * world.M) / (world.particleRadius * dist)
          this.yv +=  coeff * (Math.sin(angle) * world.M) / (world.particleRadius * dist)
        }
      }
    })
  }

  checkMouse(world) {
    if(world.mouseActive){
      const dx = world.mouseBall.attr("cx") - this.x
      const dy = world.mouseBall.attr("cy") - this.y
      const dist = Math.sqrt( dx ** 2 + dy ** 2 )
      if(dist < world.mouseRadius + world.particleRadius){
        this.xv += world.mouseXvel * world.mouseWeight
        this.yv += world.mouseYvel * world.mouseWeight
      }
    }
  }

  addAttrition(world) {
    this.xv *= world.attrition
    this.yv *= world.attrition
  }

  move(world) {
    this.x += this.xv
    this.y += this.yv
    this.group
        .attr("transform", "translate(" + this.x + "," + this.y + ")")
  }

  addRandomTemperature(world) {
    this.xv += (0.5 - Math.random()) * world.systemEnergy * 0.1
    this.yv += (0.5 - Math.random()) * world.systemEnergy * 0.1
  }

  getMomentum() {
    this.speed = Math.sqrt(this.xv ** 2 + this.yv ** 2)
    return this.w * this.speed
  }

  penisSvg() {
    const penis = "M61.363,52.535c-1.308,0-2.604,0.139-3.876,0.416l-0.199-42.186l0,0C56.264,4.903,51.15,0.43,45,0.43   S33.735,4.903,32.711,10.765l0,0l-0.199,42.186c-1.273-0.277-2.569-0.416-3.876-0.416c-10.21,0-18.517,8.309-18.517,18.518   c0,10.211,8.306,18.518,18.517,18.518c7.083,0,13.251-3.998,16.364-9.855c3.113,5.857,9.28,9.855,16.364,9.855   c10.209,0,18.517-8.307,18.517-18.518C79.88,60.844,71.572,52.535,61.363,52.535z M52.889,10.765h-5.736V5.033   C49.934,5.794,52.128,7.985,52.889,10.765z M42.846,5.033v5.732h-5.737C37.871,7.985,40.065,5.794,42.846,5.033z"
  }

  drawArrow(world) {
    const arrowAngle = Math.asin(this.yv / this.speed)
    const p1x = world.particleRadius * Math.cos(arrowAngle)
    const p1y = world.particleRadius * Math.sin(arrowAngle)
    const p2x = world.particleRadius * Math.cos(arrowAngle + Math.PI)
    const p2y = world.particleRadius * Math.sin(arrowAngle + Math.PI)
    const p3x = this.xv * world.arrowMultiplier
    const p3y = this.yv * world.arrowMultiplier
    const arrow = "M"+p3x+","+p3y+"L"+p2x+","+p2y+"L"+p1x+","+p1y+"L"+p3x+","+p3y+"z"
    this.arrow = this.group
                     .append("path")
                     .attr("d", arrow)
                     .attr("fill", "white")
  }

  removeArrow() {
    this.arrow.remove()
  }

  remove() {
    this.group.remove()
  }
}
