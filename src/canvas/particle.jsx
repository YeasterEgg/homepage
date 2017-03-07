export class Particle {
  constructor(data) {
    // INSTANCE VARIABLES
    this.id = data.id
    this.r  = data.r
    this.x = data.x
    this.y = data.y

    // CLASS VARIABLES
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

  updateAndMove(particles, matrix, world) {
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
  }
}
