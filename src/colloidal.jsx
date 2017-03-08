const d3 = require('d3')
const sliders = require("./colloidal/sliders.jsx")
const Particle = require("./colloidal/particle.jsx").Particle
const padding = 175
document.workingAnimationFrames = {}

const colorList = [
  "blue",
  "red",
  "grey",
  "black",
  "orange",
  "green"
]

const world = {
  w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - padding,
  particleRadius: 3,
  strokeWidth: 6,
  attrition: 0.95,
  distMin: 5,
  distMax: 200,
  M: 10,
  mouseRadius: 15,
  mouseWeight: 1,
  mouseActive: false,
  mouseXvel: 0,
  mouseYvel: 0
}

export const startAnimation = () => {
  inputListener()
  startNewAnimation()
}

const stopOldAnimation = (size) => {
  d3.selectAll("svg").remove()
  d3.selectAll(".slider_row").remove()
  Object.keys(document.workingAnimationFrames).map( (id) => {
    document.workingAnimationFrames[id] = false
  })
}

const startNewAnimation = (size = 3, emptySpace = 20) => {
  stopOldAnimation(size, emptySpace)
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
                .style("top", padding + "px")
  const particles = addParticles(svg, particleClasses, emptySpace)
  const mouseBall = svg.append("circle")
                       .attr("r", world.mouseRadius)
                       .attr("fill", "white")
                       .attr("id", "mouse_ball")
                       .style("opacity", 0)
  mouseListener(svg, mouseBall)
  const id = size + "_" + emptySpace
  document.workingAnimationFrames[id] = true
  window.requestAnimationFrame( () => {particlesUpdate(particles, classesMatrix, mouseBall, id)})
}

const particleHash = (id, x, y, color, classId) => {
  return {
    id: id,
    x: x,
    y: y,
    color: color,
    classId: classId,
  }
}

const addParticles = (svg, particleClasses, emptySpace) => {
  const particles = []
  const gridHorLength = Math.round(world.w / (world.particleRadius * emptySpace))
  const gridVerLength = Math.round(world.h / (world.particleRadius * emptySpace))
  const gridHorSize = world.w / gridHorLength
  const gridVerSize = world.h / gridVerLength
  times(gridHorLength, (horIdx) => {
    times(gridVerLength, (verIdx) => {
      const particle = randomClassParticle(gridHorSize, gridVerSize, horIdx, verIdx, particleClasses)
      particle.put(svg, world)
      particles.push(particle)
    })
  })
  return particles
}

const randomClassParticle = (gridHorSize, gridVerSize, horIdx, verIdx, particleClasses) => {
  const classId = Math.floor(Math.random() * particleClasses.length)
  const particleClass = particleClasses[classId]
  const x = gridHorSize * horIdx + gridHorSize / 2 + (Math.random() - 0.5) * gridHorSize
  const y = gridVerSize * verIdx + gridVerSize / 2 + (Math.random() - 0.5) * gridVerSize
  return new Particle(particleHash("c" + classId + "-" + horIdx + "_" + verIdx, x, y, particleClass.color, classId))
}

const particlesUpdate = (particles, classesMatrix, mouseBall, id) => {
  particles.map((particle) => {
    particle.updateAndMove(particles, classesMatrix, world, mouseBall)
  })
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
  const sizeInput = d3.select("#size_input")
  sizeInput.attr("value", 3)
  sizeInput.on("input", () => {
    startNewAnimation(sizeInput.property("value"), emptySpaceInput.property("value"))
  })

  const emptySpaceInput = d3.select("#empty_space")
  emptySpaceInput.attr("value", 20)
  emptySpaceInput.on("input", () => {
    startNewAnimation(sizeInput.property("value"), emptySpaceInput.property("value"))
  })

  const attritionInput = d3.select("#attrition_input")
  attritionInput.attr("value", world.attrition)
  attritionInput.on("input", () => {
    world.attrition = attritionInput.property("value")
  })

  const mInput = d3.select("#m_input")
  mInput.attr("value", world.M)
  mInput.on("input", () => {
    world.M = mInput.property("value")
  })

  const interactionMinInput = d3.select("#minimum_input")
  interactionMinInput.attr("value", world.distMin)
  interactionMinInput.on("input", () => {
    world.distMin = interactionMinInput.property("value")
  })

  const interactionMouseRadius = d3.select("#mouse_radius")
  interactionMouseRadius.attr("value", world.mouseRadius)
  interactionMouseRadius.on("input", () => {
    world.mouseRadius = interactionMouseRadius.property("value")
    d3.select("#mouse_ball")
      .transition()
      .duration(100)
      .attr("r", world.mouseRadius)
  })

  const interactionMouseWeight = d3.select("#mouse_weight")
  interactionMouseWeight.attr("value", world.mouseWeight)
  interactionMouseWeight.on("input", () => {
    world.mouseWeight = interactionMouseWeight.property("value")
  })
}

const mouseListener = (svg, mouseBall) => {
  svg.on("mousedown", () => {
    world.mouseActive = true
    mouseBall.attr("cx", event.x)
             .attr("cy", event.y - padding)
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
               .attr("cy", event.y - padding)
      world.mouseXvel = event.movementX
      world.mouseYvel = event.movementY
    }
  })
}
