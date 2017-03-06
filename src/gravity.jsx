const d3 = require('d3')
const sliders = require("./gravity/sliders.jsx")
const Particle = require("./gravity/particle.jsx").Particle
const Centroid = require("./gravity/centroid.jsx").Centroid
const padding = 175

const colorList = [
  "blue",
  "red",
  "green",
  "black",
  "yellow",
  "grey"
]

let world = {
  w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - padding,
  particleRadius: 2,
  centroidRadius: 2,
  strokeWidth: 5,
  emptySpace: 20,
  attrition: 0.9,
  distMin: 0,
  distMax: 200,
  M: 10
}

let particleClasses = colorList.map((color) => { return {color: color} })

let classesMatrix = particleClasses.map( (color, idx) => {
  return particleClasses.map(() => {
    return -1
  })
})

console.log(classesMatrix)

export const startAnimation = () => {
  sliders.drawSliders("#hamburg_menu", "#sliders", "#info_menu", particleClasses, classesMatrix)
  const container = d3.select("body")
                      .append("svg")
                      .attr("width", world.w+"px")
                      .attr("height", world.h+"px")
                      .style("position", "absolute")
                      .style("top", padding + "px")

  const svg = container.append("g")
  const particles = addParticles(svg)
  const centroid = new Centroid(world.centroidRadius)
  centroid.put(svg)
  checkGravity(particles, centroid)
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

const addParticles = (svg) => {
  const particles = []
  const gridHorLength = Math.round(world.w / (world.particleRadius * world.emptySpace))
  const gridVerLength = Math.round(world.h / (world.particleRadius * world.emptySpace))
  const gridHorSize = world.w / gridHorLength
  const gridVerSize = world.h / gridVerLength
  times(gridHorLength, (horIdx) => {
    times(gridVerLength, (verIdx) => {
      const particle = randomClassParticle(gridHorSize, gridVerSize, horIdx, verIdx)
      particle.put(svg)
      particles.push(particle)
    })
  })
  return particles
}

const randomClassParticle = (gridHorSize, gridVerSize, horIdx, verIdx) => {
  const classId = Math.floor(Math.random() * particleClasses.length)
  const particleClass = particleClasses[classId]
  const x = gridHorSize * horIdx + gridHorSize / 2 + (Math.random() - 0.5) * gridHorSize
  const y = gridVerSize * verIdx + gridVerSize / 2 + (Math.random() - 0.5) * gridVerSize
  return new Particle(particleHash("c" + classId + "-" + horIdx + "_" + verIdx, x, y, particleClass.color, classId))
}

const checkGravity = (particles, centroid) => {
  centroid.moveToCentroid(particles)
  particles.map((particle) => {
    particle.updateAndMove(particles, centroid, classesMatrix, world)
  })
  window.requestAnimationFrame( () => {checkGravity(particles, centroid)})
}

const times = (n,callback) => {
  const m = n
  while(n > 0){
    callback(m - n)
    n--
  }
}
