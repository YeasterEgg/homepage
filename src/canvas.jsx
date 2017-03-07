const Particle = require("./colloidal/particle.jsx").Particle
const padding = 175

const colorList = [
  "lightblue",
  "orange",
  "grey",
  "yellow",
  "green",
  "white"
]

const world = {
  w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - padding,
  particleRadius: 2,
  particleNumber: 1000,
  attrition: 0.9,
  distMin: 5,
  distMax: 200,
  M: 10
}

const setWorldSize = (canvas) => {
  world.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  world.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - padding
  canvas.style.height = world.h + "px"
  canvas.style.width = world.w + "px"
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
    distMax: world.distMax,
    distMin: world.distMin
  }
}

const times = (n,callback) => {
  const m = n
  while(n > 0){
    callback(m - n)
    n--
  }
}

const createClasses = (size) => {
  return colorList.slice(0,size).map((color) => { return {color: color} })
}

const createMatrix = (particleClasses) => {
  return particleClasses.map( (color, idx) => {
    return particleClasses.map(() => {
      return -1
    })
  })
}

export const startAnimation = () => {
  const canvasElement = document.getElementById("colloidal-canvas")
  const canvas = canvasElement.getContext("2d")
  window.onresize = () => {setWorldSize(canvasElement)}
  setWorldSize(canvasElement)
  const size = document.getElementById("colloidal-size_input").value
  startNewAnimation(canvas, canvasElement, size)
}

const startNewAnimation = (canvas, canvasElement, size = 3) => {
  const particles = []
  const particleClasses = createClasses(size)
  const classesMatrix = createMatrix(particleClasses)
  times(world.particleNumber, (idx) => { particles.push(createParticle(particleClasses, canvasElement, idx)) })
  window.requestAnimationFrame(() => {drawCanvas(particles, canvas, classesMatrix)})
}

const createParticle = (particleClasses, canvasElement, idx) => {
  const x = Math.random() * world.h
  const y = Math.random() * world.w
  const classId = Math.floor(Math.random() * particleClasses.length)
  const particleClass = particleClasses[classId]
  return new Particle(particleHash(idx, x, y, particleClass.color, classId))
}

const drawCanvas = (particles, canvas, classesMatrix) => {
  setBackground(canvas)
  drawParticles(particles, canvas, classesMatrix)
  window.requestAnimationFrame(() => {drawCanvas(particles, canvas, classesMatrix)})
}

const setBackground = (canvas) => {
  canvas.fillStyle = "rgba(10,10,55,1)"
  canvas.fillRect(0, 0, world.w, world.h)
}


const drawParticles = (particles, canvas, classesMatrix) => {
  particles.map( (particle) => {
    particle.updateAndMove(particles, classesMatrix, world)
    canvas.fillStyle=particle.color
    canvas.fillRect(particle.x,particle.y,particle.r,particle.r)
  })
}
