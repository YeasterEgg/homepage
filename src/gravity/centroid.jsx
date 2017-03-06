const d3 = require('d3')

export class Centroid {
  constructor(r) {
    this.r = r
    this.x = 0
    this.y = 0
  }

  put(svg) {
    this.group = svg.append("g")
    this.centroid = this.group
                      .append("circle")
                      .attr("r", this.r)
                      .attr("cx", this.x)
                      .attr("cy", this.y)
                      .attr("fill", "transparent")
                      .attr("stroke", "black")
                      .attr("stroke-width", 5)

    this.group.on("click", () => {this.onClick()})
  }

  moveToCentroid(protonArray) {
    this.x = 0
    this.y = 0
    protonArray.map( (proton) => {
      this.x += proton.x
      this.y += proton.y
    })
    this.x /= protonArray.length
    this.y /= protonArray.length
    this.centroid
        .attr("cx", this.x)
        .attr("cy", this.y)
  }
}
