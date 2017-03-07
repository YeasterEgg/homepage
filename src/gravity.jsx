const d3 = require('d3')
const sliders = require("./gravity/sliders.jsx")
const Particle = require("./gravity/particle.jsx").Particle
const padding = 175
document.workingAnimationFrames = {}

const colorList = [
  "blue",
  "red",
  "grey",
  "black",
  "orange",
  "green",
  "yellow",
  "lightblue",
]

let world = {
  w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - padding,
  particleRadius: 2,
  strokeWidth: 5,
  emptySpace: 30,
  attrition: 0.8,
  distMin: 0,
  distMax: 200,
  M: 10
}

export const startAnimation = () => {
  inputListener()
  startNewAnimation()
}

const stopOldAnimation = (size) => {
  d3.selectAll("svg").remove()
  d3.selectAll(".gravity-slider_row").remove()
  Object.keys(document.workingAnimationFrames).map( (id) => {
    document.workingAnimationFrames[id] = false
  })
}

const startNewAnimation = (size = 3) => {
  stopOldAnimation(size)
  const particleClasses = colorList.slice(0,size).map((color) => { return {color: color} })
  const classesMatrix = particleClasses.map( (color, idx) => {
    return particleClasses.map(() => {
      return -1
    })
  })
  sliders.drawSliders("#hamburg_menu", "#gravity-slider_container", "#gravity-info_menu", particleClasses, classesMatrix, world.w)
  const svg = d3.select("body")
                .append("svg")
                .attr("width", world.w+"px")
                .attr("height", world.h+"px")
                .style("position", "absolute")
                .style("top", padding + "px")
  const particles = addParticles(svg, particleClasses)
  document.workingAnimationFrames[size] = true
  window.requestAnimationFrame( () => {checkGravity(particles, classesMatrix, size)})
}

const particleHash = (id, x, y, color, classId) => {
  return {
    id: id,
    x: x,
    y: y,
    color: color,
    classId: classId,
    w: world.w,
    h: world.h,
    r: world.particleRadius,
    M: world.M,
    at: world.attrition,
    sw: world.strokeWidth,
    distMax: world.distMax,
    distMin: world.distMin
  }
}

const addParticles = (svg, particleClasses) => {
  const particles = []
  const gridHorLength = Math.round(world.w / (world.particleRadius * world.emptySpace))
  const gridVerLength = Math.round(world.h / (world.particleRadius * world.emptySpace))
  const gridHorSize = world.w / gridHorLength
  const gridVerSize = world.h / gridVerLength
  times(gridHorLength, (horIdx) => {
    times(gridVerLength, (verIdx) => {
      const particle = randomClassParticle(gridHorSize, gridVerSize, horIdx, verIdx, particleClasses)
      particle.put(svg)
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

const checkGravity = (particles, classesMatrix, id) => {
  particles.map((particle) => {
    particle.updateAndMove(particles, classesMatrix, world)
  })
  if(document.workingAnimationFrames[id]){
    window.requestAnimationFrame( () => {checkGravity(particles, classesMatrix, id)})
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
  const sizeInput = d3.select("#gravity-size_choice")
  sizeInput.on("input", () => {
    startNewAnimation(sizeInput.property("value"))
  })

  const attritionInput = d3.select("#gravity-attrition_choice")
  attritionInput.on("input", () => {
    world.attrition = attritionInput.property("value")
  })
}
