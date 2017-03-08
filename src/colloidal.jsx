const d3 = require('d3')
const sliders = require("./colloidal/sliders.jsx")
const Particle = require("./colloidal/particle.jsx").Particle
document.workingAnimationFrames = {}

const colorList = [
  "lightblue",
  "red",
  "yellow",
  "green",
  "orange",
  "lightgrey"
]

const world = {
  w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  particleRadius: 5,
  strokeWidth: 6,
  attrition: 0.95,
  distMin: 5,
  distMax: 200,
  M: 10,
  mouseRadius: 15,
  mouseWeight: 1,
  mouseActive: false,
  mouseXvel: 0,
  mouseYvel: 0,
  systemEnergy: 3
}

export const startAnimation = () => {
  inputListener()
  startNewAnimation()
}

const stopOldAnimation = (size) => {
  d3.selectAll("svg").remove()
  d3.selectAll(".colloidal-slider_row").remove()
  Object.keys(document.workingAnimationFrames).map( (id) => {
    document.workingAnimationFrames[id] = false
  })
}

const startNewAnimation = (size = 3, particlesNumber = 200) => {
  stopOldAnimation(size, particlesNumber)
  const particleClasses = colorList.slice(0,size).map((color) => { return {color: color} })
  const classesMatrix = particleClasses.map( (color, idx) => {
    return particleClasses.map(() => {
      return -1
    })
  })
  sliders.drawSliders(particleClasses, classesMatrix, world.w)
  const svg = d3.select("body")
                .append("svg")
                .attr("width", world.w+"px")
                .attr("height", world.h+"px")
                .style("position", "absolute")
  const particles = addParticles(svg, particleClasses, particlesNumber)
  const mouseBall = svg.append("circle")
                       .attr("r", world.mouseRadius)
                       .attr("fill", "black")
                       .attr("id", "colloidal-mouse_ball")
                       .attr("stroke", "white")
                       .style("opacity", 0)
  mouseListener(svg, mouseBall)
  const id = size + "_" + particlesNumber
  document.workingAnimationFrames[id] = true
  window.requestAnimationFrame( () => {particlesUpdate(particles, classesMatrix, mouseBall, id)})
}

const particleHash = (x, y, color, classId) => {
  return {
    x: x,
    y: y,
    color: color,
    classId: classId,
    w: 1,
  }
}

const addParticles = (svg, particleClasses, particlesNumber) => {
  const particles = []
  times(particlesNumber, (idx) => {
    const particle = randomClassParticle(idx, particleClasses)
    particle.put(svg, world)
    particles.push(particle)
  })
  return particles
}

const randomClassParticle = (idx, particleClasses) => {
  const classId = Math.floor(Math.random() * particleClasses.length)
  const particleClass = particleClasses[classId]
  const x = Math.random() * world.w
  const y = Math.random() * world.h
  return new Particle(particleHash(x, y, particleClass.color, classId))
}

const particlesUpdate = (particles, classesMatrix, mouseBall, id) => {
  let momentum = 0
  particles.map((particle) => {
    particle.updateAndMove(particles, classesMatrix, world, mouseBall)
    momentum += particle.getMomentum()
  })
  momentum /= particles.length
  d3.select(".colloidal-momentum_value").text(Math.round(momentum * 100) / 100)
  if(document.workingAnimationFrames[id]){
    window.requestAnimationFrame( () => {particlesUpdate(particles, classesMatrix, mouseBall, id)})
  }
}

const times = (n,callback) => {
  const m = n
  while(n > 0){
    callback(m - n)
    n--
  }
}

const inputListener = () => {
  const sizeInput = d3.select("#colloidal-size_input")
  sizeInput.attr("value", 3)
  sizeInput.on("input", () => {
    startNewAnimation(sizeInput.property("value"), particlesNumberInput.property("value"))
  })

  const particlesNumberInput = d3.select("#colloidal-particles_number")
  particlesNumberInput.attr("value", 200)
  particlesNumberInput.on("input", () => {
    startNewAnimation(sizeInput.property("value"), particlesNumberInput.property("value"))
  })

  const attritionInput = d3.select("#colloidal-attrition_input")
  attritionInput.attr("value", world.attrition)
  attritionInput.on("input", () => {
    world.attrition = attritionInput.property("value")
  })

  const mInput = d3.select("#colloidal-m_input")
  mInput.attr("value", world.M)
  mInput.on("input", () => {
    world.M = mInput.property("value")
  })

  const interactionMinInput = d3.select("#colloidal-minimum_input")
  interactionMinInput.attr("value", world.distMin)
  interactionMinInput.on("input", () => {
    world.distMin = interactionMinInput.property("value")
  })

  const interactionMouseRadius = d3.select("#colloidal-mouse_radius")
  interactionMouseRadius.attr("value", world.mouseRadius)
  interactionMouseRadius.on("input", () => {
    world.mouseRadius = parseInt(interactionMouseRadius.property("value"))
    d3.select("#colloidal-mouse_ball")
      .attr("r", world.mouseRadius)
    console.log(d3.select("#colloidal-mouse_ball"))
  })

  const interactionMouseWeight = d3.select("#colloidal-mouse_weight")
  interactionMouseWeight.attr("value", world.mouseWeight)
  interactionMouseWeight.on("input", () => {
    world.mouseWeight = parseInt(interactionMouseWeight.property("value"))
  })

  const interactionSystemEnergy = d3.select("#colloidal-system_energy")
  interactionSystemEnergy.attr("value", world.systemEnergy)
  interactionSystemEnergy.on("input", () => {
    world.systemEnergy = parseInt(interactionSystemEnergy.property("value"))
  })
}

const mouseListener = (svg, mouseBall) => {
  svg.on("mousedown", () => {
    world.mouseActive = true
    mouseBall.attr("cx", event.x)
             .attr("cy", event.y)
             .transition()
             .duration(150)
             .style("opacity", 1)
  })
  svg.on("mouseup", () => {
    world.mouseActive = false
    mouseBall.transition()
             .duration(150)
             .style("opacity", 0)
  })
  svg.on("mousemove", () => {
    if(world.mouseActive){
      mouseBall.attr("cx", event.x)
               .attr("cy", event.y)
      world.mouseXvel = event.movementX
      world.mouseYvel = event.movementY
    }
  })
}
