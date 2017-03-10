const d3 = require('d3')
const Block = require('./whale/block.jsx').Block
const world = {
  w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
  lineLenght: 600,
  blockLength: 300,
  blocks: [],
  mouseBall: null,
  mouseBallRadius: 100,
  svg: null
}

export const startAnimation = () => {
  createWorld()
  followMouse()
  drawLine()
}

const createWorld = () => {
  world.svg = d3.select("body")
                .append("svg")
                .attr("width", world.w+"px")
                .attr("height", world.h+"px")
  world.mouseBall = world.svg
                         .append("circle")
                         .attr("cx", world.w/2)
                         .attr("cy", world.h/2)
                         .attr("r", world.mouseBallRadius)
                         .attr("stroke","steelblue")
                         .attr("stroke-width", 3)
                         .attr("fill", "transparent")
}

const drawLine = () => {
  const startX = (world.w/2) - (world.lineLenght/2)
  const startY = world.h/2

  times(world.lineLenght/world.blockLength, (idx) => {
    const x0 = startX + idx * world.blockLength
    const y0 = startY
    const x1 = x0 + world.blockLength
    const y1 = startY
    const path = "M"+x0+","+y0+"L"+x1+","+y1
    const block = new Block(x0, y0, x1, y1, world.blockLength, idx)
    block.put(world)
    world.blocks.push(block)
  })
}

const times = (a,callback) => {
  const b = a
  while(a > 0){
    callback(b - a)
    a--
  }
}

const followMouse = () => {
  world.svg.on("mousemove", () => {
    world.mouseBall
         .attr("cx", d3.event.x)
         .attr("cy", d3.event.y)
    world.mouseX = d3.event.x
    world.mouseY = d3.event.y
    world.blocks.map( (block) => {
      block.checkTangent(world.mouseX, world.mouseY, world.mouseBallRadius)
    })
  })
}
