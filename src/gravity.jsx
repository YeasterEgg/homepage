const d3 = require('d3')
const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
const radius = 20

let time = 0
const Proton = require("./gravity/proton.jsx").Proton

const times = (n,callback) => {
  const m = n
  while(n > 0){
    callback(m - n)
    n--
  }
}

const protonArray = (id, x, y, protons) => {
  return {
    id: id,
    x: x,
    y: y,
    w: w,
    h: h,
    r: radius,
    xSpd: (Math.random() - 0.5) * 4,
    ySpd: (Math.random() - 0.5) * 4,
    protons: protons
  }
}

export const startAnimation = () => {
  const container = d3.select("body")
                      .append("svg")
                      .attr("width", w+"px")
                      .attr("height", h+"px")
  const svg = container.append("g")
  const protons = []
  const gridHorLength = Math.round(w / (radius * 10))
  const gridVerLength = Math.round(h / (radius * 10))
  const gridHorSize = w / gridHorLength
  const gridVerSize = h / gridVerLength
  const center = svg.append("circle")
                    .attr("stroke", "black")
                    .attr("stroke-width", 5)
                    .attr("r", 5)

  // times(gridHorLength, (horIdx) => {
  //   times(gridVerLength, (verIdx) => {
  //     const proton = new Proton({
  //       x: gridHorSize * horIdx + gridHorSize / 2 + (Math.random() - 0.5) * gridHorSize,
  //       y: gridVerSize * verIdx + gridVerSize / 2 + (Math.random() - 0.5) * gridVerSize,
  //       r: radius,
  //       w: w,
  //       h: h
  //     })
  //     proton.put(svg)
  //     protons.push(proton)
  //   })
  // })

  const test = [1,2,3,4]
  test.map( (i) => {
    const proton = new Proton(protonArray(i, Math.random() * w, Math.random() * h, protons))
    proton.put(svg)
    protons.push(proton)
  })

  window.requestAnimationFrame( () => {
    checkGravity(center, protons)
  })
}

const checkCenter = (array) => {
  const coords = {
    x: 0,
    y: 0
  }
  array.map( (proton) => {
    coords.x += proton.x
    coords.y += proton.y
  })
  coords.x /= array.length
  coords.y /= array.length
  return coords
}

const checkGravity = (center, protons) => {
  const coords = checkCenter(protons)
  center.attr("cx", coords.x)
        .attr("cy", coords.y)

  protons.map( (proton, idx) => {
    proton.move(1, coords)
  })
  window.requestAnimationFrame( () => {checkGravity(center, protons)})
}
