const d3 = require('d3')
const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
const radius = 10

export const startAnimation = () => {
  const container = d3.select("body")
                      .append("svg")
                      .attr("width", w+"px")
                      .attr("height", h+"px")

  const svg = container.append("g")

  drawBall(svg, 194, 324)

  container.on("mousemove", () => {
  })
}


const drawBall = (svg, x, y, r) => {
  svg.append("circle")
     .attr("r", radius)
     .attr("cx", x)
     .attr("cy", y)
     .attr("fill", "transparent")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 3)
}
