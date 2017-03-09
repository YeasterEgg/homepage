const d3 = require('d3')
const drawSliders = require("./colloidal/sliders.jsx").drawSliders
const Particle = require("./colloidal/particle.jsx").Particle

///////////////////////
// SYSTEM VARIABLES //
/////////////////////

const world = {
  arrowMultiplier: 20,
  attrition: 0.95,
  classesMatrix: null,
  colorList: [
    "lightblue",
    "red",
    "yellow",
    "green",
    "orange",
    "lightgrey"
  ],
  currentClasses: 3,
  distMax: 200,
  distMin: 5,
  h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  M: 10,
  mouseActive: false,
  mouseBall: null,
  mouseRadius: 15,
  mouseXvel: 0,
  mouseWeight: 1,
  mouseYvel: 0,
  particleClasses: null,
  particleRadius: 5,
  particles: [],
  particlesNumber: 150,
  running: true,
  strokeWidth: 6,
  svg: null,
  systemEnergy: 3,
  w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
}

//////////////////////
// BASIC FUNCTIONS //
////////////////////

export const startAnimation = () => {
  startNewAnimation()
  drawSliders(world)
  startAllListeners()
}

const times = (a,callback) => {
  const b = a
  while(a > 0){
    callback(b - a)
    a--
  }
}

//////////////////////////
// ANIMATION FUNCTIONS //
////////////////////////

const startNewAnimation = () => {
  world.particleClasses = world.colorList.slice(0,world.currentClasses).map((color) => { return {color: color} })
  world.classesMatrix = world.particleClasses.map( (color, idx) => {
    return world.particleClasses.map(() => {
      return -1
    })
  })
  world.svg = d3.select("body")
                .append("svg")
                .attr("width", world.w+"px")
                .attr("height", world.h+"px")
                .style("position", "absolute")
  world.particles = addParticles()
  world.mouseBall = world.svg
                         .append("circle")
                         .attr("r", world.mouseRadius)
                         .attr("fill", "black")
                         .attr("id", "colloidal-mouse_ball")
                         .attr("stroke", "white")
                         .style("opacity", 0)
  world.running = true
  window.requestAnimationFrame( () => {particlesUpdate()})
}

//////////////////////
// INPUT FUNCTIONS //
////////////////////

const startAllListeners = () => {
  inputListener()
  pauseListener()
  mouseListener()
  windowResizeListener()
}

const inputListener = () => {
  const inputs = {
    attrition: ["#colloidal-attrition_input", (value, key) => {world[key] = parseInt(value)}],
    M: ["#colloidal-m_input", (value, key) => {world[key] = parseInt(value)}],
    distMin: ["#colloidal-minimum_input", (value, key) => {world[key] = parseInt(value)}],
    systemEnergy: ["#colloidal-system_energy", (value, key) => {world[key] = parseInt(value)}],
    mouseWeight: ["#colloidal-mouse_weight", (value, key) => {world[key] = parseInt(value)}],
    currentClasses: ["#colloidal-size_input", setNewClassesNumber],
    particlesNumber: ["colloidal-particles_number", setNewParticleNumber],
    mouseRadius: ["#colloidal-mouse_radius", setMouseRadius]
  }

  Object.keys(inputs).map( (key) => {
    const inputElement = d3.select(inputs[key][0])
    inputElement.attr("value", world[key])
    inputElement.on("input", () => {
      inputs[key][1](inputElement.property("value"), key)
    })
  })
}

const pauseListener = () => {
  const particleSpeed = d3.select(".colloidal-particle_container")
  d3.select(".colloidal-pause_button").on("click", () => {
    if(world.running){
      world.running = false
      particleSpeed.style("display", "block")
                   .transition()
                   .duration(200)
                   .style("opacity", 1)

      world.particles.map( (particle) => {
        particle.drawArrow(world)
      })

      d3.select(".material-icons").text("play_arrow")
    }else{
      world.running = true
      particleSpeed.transition()
                   .duration(200)
                   .style("opacity", 0)
                   .on("end", () => {
                      particleSpeed.style("display", "none")
                   })

      world.particles.map( (particle) => {
        particle.removeArrow()
      })

      d3.select(".material-icons").text("pause")
      window.requestAnimationFrame( () => {particlesUpdate()})
    }
  })
}

const windowResizeListener = () => {
  window.onresize = () => {
    world.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    world.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    world.svg
         .attr("width", world.w+"px")
         .attr("height", world.h+"px")
  }
}

const mouseListener = () => {
  world.svg.on("mousedown", () => {
    world.mouseActive = true
    world.mouseBall
         .attr("cx", event.x)
         .attr("cy", event.y)
         .transition()
         .duration(150)
         .style("opacity", 1)
  })
  world.svg.on("mouseup", () => {
    world.mouseActive = false
    world.mouseBall
         .transition()
         .duration(150)
         .style("opacity", 0)
  })
  world.svg.on("mousemove", () => {
    if(world.mouseActive){
      world.mouseBall
           .attr("cx", event.x)
           .attr("cy", event.y)
      world.mouseXvel = event.movementX
      world.mouseYvel = event.movementY
    }
  })
}

/////////////////////////
// RESPONSE FUNCTIONS //
///////////////////////

const setNewParticleNumber = (newParticlesNumber) => {
  const diff = world.particlesNumber - parseInt(newParticlesNumber)
  let agendaParticle
  if(diff > 0){
    times(diff, (idx) => {
      agendaParticle = world.particles.pop()
      agendaParticle.remove()
    })
  }else if(diff < 0){
    times(-diff, (idx) => {
      const agendaParticle = randomClassParticle(world.particlesNumber + idx)
      agendaParticle.put(world.svg, world)
      world.particles.push(agendaParticle)
    })
  }
  world.particlesNumber = newParticlesNumber
}

const setNewClassesNumber = (newClassesNumber) => {
  if(newClassesNumber > world.currentClasses){
    world.particleClasses = world.colorList.slice(0, newClassesNumber).map((color) => { return {color: color} })
    world.classesMatrix = world.particleClasses.map( (color, idx) => {
      return world.particleClasses.map(() => {
        return -1
      })
    })
    world.particles.map( (particle, idx) => {
      if(idx % newClassesNumber == 0){
        const classId = world.particleClasses.length -1
        const particleClass = world.particleClasses[classId]
        particle.redraw(particleClass.color, classId)
      }
    })
  }else if(newClassesNumber < world.currentClasses){
    world.particleClasses = world.colorList.slice(0,newClassesNumber).map((color) => { return {color: color} })
    world.classesMatrix = world.particleClasses.map( (color, idx) => {
      return world.particleClasses.map(() => {
        return -1
      })
    })
    world.particles.map( (particle) => {
      if(particle.classId > newClassesNumber - 1){
        const classId = Math.floor(Math.random() * world.particleClasses.length)
        const particleClass = world.particleClasses[classId]
        particle.redraw(particleClass.color, classId)
      }
    })
  }
  world.currentClasses = newClassesNumber
  d3.selectAll(".colloidal-slider_row").remove()
  drawSliders(world)
}

const setMouseRadius = (value, key) => {
  world.mouseRadius = parseInt(value)
  d3.select("#colloidal-mouse_ball")
    .attr("r", world.mouseRadius)
}

/////////////////////////
// PARTICLE FUNCTIONS //
///////////////////////

const addParticles = () => {
  const particles = []
  times(world.particlesNumber, (idx) => {
    const particle = randomClassParticle(idx)
    particle.put(world)
    particles.push(particle)
  })
  return particles
}

const randomClassParticle = (idx) => {
  const classId = Math.floor(Math.random() * world.particleClasses.length)
  const color = world.particleClasses[classId].color
  const w = 1
  const x = Math.random() * world.w
  const y = Math.random() * world.h
  return new Particle({x: x, y: y, color: color, classId: classId, w: w})
}

const particlesUpdate = () => {
  let momentum = 0
  world.particles.map((particle) => {
    particle.updateAndMove(world.particles, world.classesMatrix, world, world.mouseBall)
    momentum += particle.getMomentum()
  })
  momentum /= world.particles.length
  d3.select(".colloidal-momentum_value").text(Math.round(momentum * 100) / 100)
  if(world.running){
    window.requestAnimationFrame( () => {particlesUpdate()})
  }
}
