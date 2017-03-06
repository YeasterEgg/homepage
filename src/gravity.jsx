const d3 = require('d3')
const Particle = require("./gravity/particle.jsx").Particle
const Centroid = require("./gravity/centroid.jsx").Centroid

const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
const particleRadius = 6
const centroidRadius = 2
const attrition = 0.95

const M = 10

const times = (n,callback) => {
  const m = n
  while(n > 0){
    callback(m - n)
    n--
  }
}

const particleHash = (id, x, y, color, classId) => {
  return {
    id: id,
    x: x,
    y: y,
    w: w,
    h: h,
    r: particleRadius,
    M: M,
    at: attrition,
    sw: 5,
    color: color,
    classId: classId
  }
}

const particleClasses = [
  {color: "red"},
  {color: "blue"},
  {color: "green"}
]

const classesMatrix = [
  [(0.5 - Math.random()) * 2, (0.5 - Math.random()) * 2, (0.5 - Math.random()) * 2],
  [(0.5 - Math.random()) * 2, (0.5 - Math.random()) * 2, (0.5 - Math.random()) * 2],
  [(0.5 - Math.random()) * 2, (0.5 - Math.random()) * 2, (0.5 - Math.random()) * 2]
]

export const startAnimation = () => {
  const container = d3.select("body")
                      .append("svg")
                      .attr("width", w+"px")
                      .attr("height", h+"px")
  const svg = container.append("g")
  const particles = [
    [],[],[]
  ]
  const centroids = []
  addParticles(svg, particles)
  particles.map( (particleClass) => {
    const centroid = new Centroid(centroidRadius)
    centroid.put(svg)
    centroids.push(centroid)
  })
  window.requestAnimationFrame( () => {
    checkGravity(centroids, particles)
  })
}

const addParticles = (svg, particles) => {
  const gridHorLength = Math.round(w / (particleRadius * 20))
  const gridVerLength = Math.round(h / (particleRadius * 20))
  const gridHorSize = w / gridHorLength
  const gridVerSize = h / gridVerLength
  times(gridHorLength, (horIdx) => {
    times(gridVerLength, (verIdx) => {
      const particle = randomClassParticle(gridHorSize, gridVerSize, horIdx, verIdx)
      particle.put(svg)
      particles[particle.classId].push(particle)
    })
  })
}

const randomClassParticle = (gridHorSize, gridVerSize, horIdx, verIdx) => {
  const classId = Math.floor(Math.random() * particleClasses.length)
  const particleClass = particleClasses[classId]
  const x = gridHorSize * horIdx + gridHorSize / 2 + (Math.random() - 0.5) * gridHorSize
  const y = gridVerSize * verIdx + gridVerSize / 2 + (Math.random() - 0.5) * gridVerSize
  return new Particle(particleHash(horIdx + "_" + verIdx, x, y, particleClass.color, classId))
}

const checkGravity = (centroids, particles) => {
  particleClasses.map( (particleClass, idx) => {
    centroids[idx].moveToCentroid(particles[idx])
    particles[idx].map( (proton) => {
      proton.updateStatus(centroids[idx], particles[idx])
    })
  })
  window.requestAnimationFrame( () => {checkGravity(centroids, particles)})
}
