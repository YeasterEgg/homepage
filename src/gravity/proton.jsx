const d3 = require('d3')

export class Proton {
  constructor(data) {
    this.id = data.id
    this.r = data.r
    this.w = data.w
    this.h = data.h

    this.x0 = data.x
    this.y0 = data.y
    this.x = data.x
    this.y = data.y

    this.xSpd0 = data.xSpd
    this.ySpd0 = data.ySpd
    this.xSpd1 = data.xSpd
    this.ySpd1 = data.ySpd
  }

  put(svg) {
    this.group = svg.append("g")
    this.proton = this.group
                      .append("circle")
                      .attr("r", this.r)
                      .attr("cx", this.x0)
                      .attr("cy", this.y0)
                      .attr("fill", "transparent")
                      .attr("stroke", "red")
                      .attr("stroke-width", 4)

    this.group.on("click", () => {this.onClick()})
  }

  onClick() {
    this.xSpd = 0
    this.ySpd = 0
  }

  nextSpeed(center) {
    if(this.x < this.r || this.x > (this.w - this.r)){
      this.xSpd1 += -2 * this.xSpd0
    }
    if(this.y < this.r || this.y > (this.h - this.r)){
      this.ySpd1 += -2 * this.ySpd0
    }
  }

  move(timeframe, center) {
    this.nextSpeed(center)
    this.x += this.xSpd1 * timeframe
    this.y += this.ySpd1 * timeframe
    this.group
        .attr("transform", "translate(" + (this.x - this.x0) + "," + (this.y - this.y0) + ")")
    this.xSpd0 = this.xSpd1
    this.ySpd0 = this.ySpd1
  }
}
