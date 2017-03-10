const d3 = require('d3')

export class Block {
  constructor(x0, y0, x1, y1, l, id) {
    this.x0base = x0
    this.y0base = y0
    this.x1base = x1
    this.y1base = y1

    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1

    this.l  = l
    this.id = id
    this.touched = false
  }

  put(world) {
    this.group = world.svg
                      .append("g")

    this.path = this.group
                    .append("path")
                    .attr("d", this.pathFromCoord())
                    .attr("stroke", "black")
                    .attr("stroke-width", 5)
  }

  pathFromCoord(){
    return "M"+this.x0+","+this.y0+"L"+this.x1+","+this.y1
  }

  checkTangent(px, py, r) {
    if(this.x0 == this.x1){
      this.checkTangentVertical(px, py, r)
    }else if(this.y0 == this.y1){
      this.checkTangentHorizontal(px, py, r)
    }
    if(this.x0 <= px && px <= this.x && this.y0 <= py && py <= this.y1){
      this.insideExtremes(px, py, r)
    }else{
      this.checkExtremes(px, py, r)
    }
  }

  checkTangentVertical(px, py, r){
    if(this.y0 <= py && py <= this.y1){
      this.insideExtremes(px, py, r)
    }else{
      this.checkExtremes(px, py, r)
    }
  }

  checkTangentHorizontal(px, py, r){
    if(this.x0 <= px && px <= this.x1){
      this.insideExtremes(px, py, r)
    }else{
      this.checkExtremes(px, py, r)
    }
  }

  checkExtremes(px, py, r){
    const dx0 = Math.sqrt( (this.x0 - px) ** 2 + (this.y0 - py) ** 2 )
    if(dx0 < r){
      this.tangent("x0")
    }
    const dx1 = Math.sqrt( (this.x1 - px) ** 2 + (this.y1 - py) ** 2 )
    if(dx1 < r){
      this.tangent("x1")
    }
  }

  insideExtremes(px, py, r){

  }

  tangent(mess){
    console.log(mess)
  }

  distance(x0, y0, x1, y1) {
    return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
  }

  moveUp(world) {
    this.path.attr("stroke", "red")
  }

  moved() {
    return !(this.x0base == this.x0 && this.y0base == this.y0 && this.x1base == this.x1 && this.y1base == this.y1)
  }

  followMouse(px, py){
    const cx = this.x1 - this.x0
    const cy = this.y1 - this.y0
    const dist = this.distance(cx, cy, px, py)
    const angle = Math.acos(this.l / (dist * 2) )
    console.log(angle)
    const dy = Math.sin(angle) * dist

    this.y0 += dy
    this.y1 += dy

    this.path
        .attr("stroke", "black")
        .transition()
        .duration(100)
        .attr("d", this.pathFromCoord())
    const x0Trans = this.x0 - cx
    const x1Trans = this.x1 - cx
    const y0Trans = this.y0 - cy
    const y1Trans = this.y1 - cy
  }

  moveBack() {
    if(this.touched == false && this.moved()){
      this.x0 = this.x0base
      this.y0 = this.y0base
      this.x1 = this.x1base
      this.y1 = this.y1base
      this.path
          .attr("stroke", "black")
          .transition()
          .duration(100)
          .attr("d", this.pathFromCoord())
    }
  }
}
