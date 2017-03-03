const d3 = require('d3')

export class Petri {

  constructor(data) {
    this.w = data.w,
    this.h = data.h,
    this.r = data.r,
    this.x = data.x,
    this.y = data.y,
    this.dish = null
  }

  put(svg){
    this.group = svg.append("g")
    this.dish = this.group
                    .append("circle")
                    .attr("r", this.r)
                    .attr("cx", this.x)
                    .attr("cy", this.y)
                    .attr("fill", "white")
  }
}
