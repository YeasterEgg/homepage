const d3 = require('d3')
const imgHeight = 48
const imgWidth  = 40

export class Yeast {
  constructor(data) {
    this.variables = {
      w: data.w,
      h: data.h,
      r: data.r,
      x: data.x,
      y: data.y,
      color: data.color,
      title: data.title,
      gitUrl: data.git,
      urlUrl: data.url,
      header: data.header,
      descriptionArray: data.description,
      genome: data.genome,
      first: data.first,
      name: data.name,
      colorPalette: data.colorPalette,
      cellTransform: null,
      draggable: data.draggable,
      socket: data.socket
    }

    this.state = {
      huge: false
    }

    this.text = {
      textualParts: null
    }

    this.structures = {
      container: null,
      cell: null,
      membrane: null,
      organelles: null,
      nucleus: null,
      dna: null,
      mitochondria: null
    }

    this.invariables = {
      population: null,
      hugeMultiplier: 4,
      membranePointNumber: Math.round(data.r / 5),
      organellePointNumber: Math.round(data.r / 2),
      organellePositionsArray: this.shuffleArray([["-", "-"], ["","-"], ["-",""], ["", ""]]),
      radialLineGenerator: d3.radialLine()
                             .curve(d3.curveBasisClosed)
                             .angle( (d) => {return d.angle} )
                             .radius( (d) => {return d.r} )
    }
  }

  birth(container, population) {
    population[this.variables.name] = this
    this.structures.container = container
    this.invariables.population = population

    this.structures.cell = this.structures
                               .container
                               .append("g")
                               .attr("class", "yeast--container")
                               .classed("yeast--container_first", this.first)

    this.structures.cell.on("mouseenter", () => {this.onCellHover()} )
    this.structures.cell.on("mouseleave", () => {this.onCellOut()} )
    this.structures.cell.on("click", () => {this.onCellClick()} )

    this.translateCell()
    this.drawMembrane()
    this.drawOrganelles()
    this.addText()
    this.drawGems()
  }

  translateCell(){
    this.invariables.cellTransform = d3.zoomTransform(this.structures.cell)
    this.invariables.cellTransform.x = this.variables.x
    this.invariables.cellTransform.y = this.variables.y
    this.structures
        .cell
        .attr("transform", this.invariables.cellTransform)
  }

  drawMembrane() {
    const points = this.randomCirclePointsGenerator(this.invariables.membranePointNumber, this.variables.r)
    this.structures.membrane = this.structures
                                   .cell
                                   .append("path")
                                   .attr("d", this.invariables.radialLineGenerator(points))
                                   .attr("fill", this.variables.color)
                                   .attr("class", "yeast--mother yeast--breathing yeast--" + this.variables.title)
    this.breathe()
  }

  breathe() {
    const radius = this.state.huge ? this.variables.r * this.invariables.hugeMultiplier : this.variables.r
    const points = this.randomCirclePointsGenerator(this.invariables.membranePointNumber, radius)
    this.structures
        .membrane
        .transition()
        .duration(1000 + Math.random() * 1000)
        .ease(d3.easeQuadInOut)
        .attr("d", this.invariables.radialLineGenerator(points))
        .on("end", () => {this.breathe()})
  }

  drawGems() {
    this.structures.gems = this.structures
                               .cell
                               .append("g")
                               .style("opacity", 0)
                               .attr("display", "none")

    this.structures.git = this.structures
                              .gems
                              .append("g")

    this.structures.url = this.structures
                              .gems
                              .append("g")

    this.structures
        .git
        .append("a")
        .attr("xlink:href", this.variables.gitUrl)
        .attr("target", "_blank")
        .attr("transform", "translate(-" + ((imgWidth / 2) + (this.variables.r * this.invariables.hugeMultiplier / 3)) + " " + (this.variables.r * this.invariables.hugeMultiplier / 3) + ")")
        .append("svg:image")
        .attr('width', imgWidth)
        .attr('height', imgHeight)
        .attr("xlink:href","static/pics/github.png")
        .on("click", () => {
          d3.event.stopPropagation()
        })

    this.structures
        .url
        .append("a")
        .attr("xlink:href", this.variables.urlUrl)
        .attr("target", "_blank")
        .attr("transform", "translate(" + (this.variables.r * this.invariables.hugeMultiplier / 3) + " " + (this.variables.r * this.invariables.hugeMultiplier / 3) + ")")
        .append("svg:image")
        .attr('width', imgWidth)
        .attr('height', imgHeight)
        .attr("xlink:href", this.variables.first ? "static/pics/linkedin.png" : "static/pics/web.png")
        .on("click", () => {
          d3.event.stopPropagation()
        })
  }

  addText() {
    this.text.textualParts = this.structures
                                 .cell
                                 .append("g")
                                 .style("opacity",0)

    this.text.title = this.text
                          .textualParts
                          .append("text")
                          .attr("class", "yeast--title yeast--transparent yeast--" + this.variables.title)
                          .attr("id", "yeast--" + this.variables.title)
                          .attr("transform", "translate(0 -" + this.variables.r/3 + ")")
                          .attr("text-anchor", "middle")
                          .attr("font-size", this.variables.r * 0.22 + "px")
                          .attr("font-weight", "bold")
                          .text(this.variables.title)

    this.text.header = this.text
                           .textualParts
                           .append("text")
                           .attr("text-anchor", "middle")
                           .attr("font-size", this.variables.r * 0.15 + "px")
                           .text(this.variables.header)

    this.text.descriptionText = this.text
                                    .textualParts
                                    .append("text")
                                    .attr("class", "yeast--description")
                                    .attr("transform", "translate(0 " + this.variables.r/3 + ")")
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", this.variables.r * 0.18 + "px")
                                    .style('opacity', 1)
                                    .text(this.variables.descriptionArray[0])
                                    .attr("idx", 0)
    this.showGroup(this.text.textualParts, 800, 1)
    this.cycleDescription()
  }

  cycleDescription() {
    const max = this.variables.descriptionArray.length - 1
    let newIndex
    const currentIndex = parseInt(this.text.descriptionText.attr("idx"))
    if(currentIndex == max){
      newIndex = 0
    }else{
      newIndex = currentIndex + 1
    }
    setTimeout( () => {
      this.text
          .descriptionText
          .transition()
          .duration(1000)
          .style("opacity", 0)
          .on("end", () => {
            this.text
                .descriptionText
                .text(this.variables.descriptionArray[newIndex])
                .attr("idx", newIndex)
            this.text
                .descriptionText
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .on("end", () => {
                  this.cycleDescription()
                })
          })
    }, 4000)
  }

  onCellHover() {
    if(!this.state.huge){
      this.showGroup(this.text.textualParts, 300, 0.1)
      this.showGroup(this.structures.organelles, 300, 1)
    }
  }

  onCellOut() {
    if(!this.state.huge){
      this.showGroup(this.structures.organelles, 300, 0.1)
      this.showGroup(this.text.textualParts, 300, 1)
    }
  }

  onCellClick() {
    if(!this.state.huge){
      this.center(() => {
        this.embiggen()
      })
    }else{
      this.smaller(() => {
        this.goBack()
      })
    }
  }

  center(callback) {
    this.removeOthers()
    this.invariables.cellTransform.x = this.variables.w / 2
    this.invariables.cellTransform.y = this.variables.h / 2
    this.structures
        .cell
        .transition()
        .duration(1000)
        .attr("transform", this.invariables.cellTransform)
        .on("end", () => callback() )
  }

  goBack() {
    this.showOthers()
    this.invariables.cellTransform.x = this.variables.x
    this.invariables.cellTransform.y = this.variables.y
    this.structures
        .cell
        .transition()
        .duration(1000)
        .attr("transform", this.invariables.cellTransform)
  }

  embiggen() {
    this.state.huge = true
    const newPoints = this.randomCirclePointsGenerator(this.invariables.membranePointNumber, this.variables.r * this.invariables.hugeMultiplier)
    this.structures
        .membrane
        .transition()
        .duration(1000)
        .attr("d", this.invariables.radialLineGenerator(newPoints))
        .on("end", () => {
          this.hideGroup(this.structures.organelles, 800, 0)
          this.showGroup(this.structures.dna, 800, 1)
          this.showGroup(this.structures.gems, 800, 1)
          this.showGroup(this.text.textualParts, 800, 1)
          this.breathe()
        })
  }

  smaller(callback) {
    const newPoints = this.randomCirclePointsGenerator(this.invariables.membranePointNumber, this.variables.r)
    this.hideGroup(this.structures.gems, 800, 0)
    this.hideGroup(this.structures.dna, 800, 0)
    this.structures
        .membrane
        .transition()
        .duration(1000)
        .attr("d", this.invariables.radialLineGenerator(newPoints))
        .on("end", () => {
          this.state.huge = false
          this.breathe()
          this.showGroup(this.structures.organelles, 800, 1)
          callback()
        })
  }

  removeOthers(callback) {
    Object.keys(this.invariables.population).map( (yeastName) => {
      if(yeastName != this.variables.title){
        this.invariables.population[yeastName].hide()
      }
    })
  }

  showOthers() {
    Object.keys(this.invariables.population).map( (yeastName) => {
      if(yeastName != this.variables.title){
        this.invariables.population[yeastName].show()
      }
    })
  }

  hide() {
    this.hideGroup(this.structures.cell, 1400, 0)
  }

  show() {
    this.showGroup(this.structures.cell, 600, 1)
    this.breathe()
  }

  drawOrganelles() {
    this.structures.organelles = this.structures
                                     .cell
                                     .append("g")
                                     .style("opacity", 0.1)
    this.drawNucleus()
    this.drawMitochondria()
    this.drawGolgi()
    this.drawDna()
  }

  drawNucleus() {
    const signs = this.invariables.organellePositionsArray[0]
    const nucleusPoints = this.randomCirclePointsGenerator(this.invariables.organellePointNumber, this.variables.r * 0.3)
    const nucleulusPoints = this.randomCirclePointsGenerator(this.invariables.organellePointNumber, this.variables.r * 0.1)
    this.structures.nucleus = this.structures
                                  .organelles
                                  .append("g")
                                  .attr("transform", "translate(" + signs[0] + (this.variables.r * (0.3 + 0.2 * Math.random())) + " " + signs[1] + (this.variables.r * (0.3 + 0.2 * Math.random())) + ")")

    this.structures
        .nucleus
        .append("path")
        .attr("d", this.invariables.radialLineGenerator(nucleusPoints))
        .attr("fill", "url(#nucleusRadialGradient)")

    const nucleusTranslate = {
      x: Math.random() > 0.5 ? this.variables.r * Math.random() : -this.variables.r * Math.random(),
      y: Math.random() > 0.5 ? this.variables.r * Math.random() : -this.variables.r * Math.random(),
    }

    this.structures
        .nucleus
        .append("path")
        .attr("d", this.invariables.radialLineGenerator(nucleulusPoints))
        .attr("fill", "#ff664c")
        .attr("transform", "translate(" + (0.2 * nucleusTranslate.x) + " " + (0.2 * nucleusTranslate.y) + ")")
  }

  drawMitochondria() {
    const signsArray = this.invariables.organellePositionsArray.slice(1,3)
    signsArray.map( (signs) => {
      const rotation = Math.random()
      const mitocondriaPoints = this.randomEllipsePointsGenerator(this.invariables.organellePointNumber, this.variables.r * 0.2, rotation)
      const wormPoints = this.randomWormPointsGenerator(this.invariables.organellePointNumber, this.variables.r * 0.2, rotation)
      const mitochondria = this.structures
                               .organelles
                               .append("g")
                               .attr("transform", "translate(" + signs[0] + (this.variables.r * (0.3 + 0.2 * Math.random())) + " " + signs[1] + (this.variables.r * (0.3 + 0.2 * Math.random())) + ")")

      mitochondria.append("path")
                  .attr("d", this.invariables.radialLineGenerator(mitocondriaPoints))
                  .attr("fill", "#abab9a")

      mitochondria.append("path")
                  .attr("d", this.invariables.radialLineGenerator(wormPoints))
                  .attr("fill", "#F5F5DC")
    })
  }

  drawGolgi() {
    const signs = this.invariables.organellePositionsArray[3]
    const golgi = this.structures
                      .organelles
                      .append("g")
                      .attr("transform", "translate(" + signs[0] + (this.variables.r * (0.3 + 0.2 * Math.random())) + " " + signs[1] + (this.variables.r * (0.3 + 0.2 * Math.random())) + ")")
    golgi.append("path")
         .attr("d", "m10,0 s10,10 20,-5 m-30,3 s15,15 30,0 m-30,3 s10,10 20,5 m-20,0 s10,10 35,-3")
         .attr("stroke", "black")
         .attr("stroke-width", "2px")
         .attr("fill", "transparent")
         .attr("transform", "rotate(" + Math.random() * 180 + ")")
  }

  drawDna() {
    this.structures.dna = this.structures
                              .cell
                              .append("g")
                              .style("opacity", 0)
                              .attr("display", "none")
                              .attr("transform", "translate(0,-" + this.variables.r * this.invariables.hugeMultiplier / 2 + ")")

    const ploidy = Object.keys(this.variables.genome).length
    const total = Object.values(this.variables.genome).reduce((a, b) => a + b, 0)

    Object.keys(this.variables.genome).map( (gene, idx) => {
      this.drawChromosome(gene, idx, ploidy, total)
    })
  }

  drawChromosome(gene, idx, ploidy, total) {
    const value = this.variables.genome[gene]
    const height =  0.1 * this.variables.r * this.invariables.hugeMultiplier * Math.log(value) / Math.log(total)
    const part = idx / (ploidy - 1)
    const ratio = value / total
    const position = {
      x: -this.variables.r * this.invariables.hugeMultiplier / 2 + this.variables.r * this.invariables.hugeMultiplier * part,
      y: 0
    }
    const chromosome = this.structures.dna.append("g")
    chromosome.attr("fill", this.chromosomeColor(gene))

    const data = d3.range(0, 2 * Math.PI, .1)
                   .map(function(t) {
                      return {
                        angle: t + Math.PI * 0.5,
                        r: height * (Math.sin(4 * t) - 2 * Math.sin(2 * t))
                      }
                   })

    chromosome.append("path")
              .attr("class", "line")
              .attr("d", this.invariables.radialLineGenerator(data))
              .attr("transform", "translate(" + position.x + " " + position.y + ")")

    chromosome.append("text")
              .attr("transform", "translate(" + (position.x - this.variables.r * this.invariables.hugeMultiplier / 12) + " " + (position.y + this.variables.r * this.invariables.hugeMultiplier / 3) + ")")
              .text(Math.round(ratio * 1000)/10 + "%")
              .attr("fill", "black")
              .attr("font-size", this.variables.r * this.invariables.hugeMultiplier / 12 + "px")
  }

  chromosomeColor(language) {
    return this.variables.colorPalette[language] || "yellow"
  }

  randomCirclePointsGenerator(times, baseRadius, error = 0.2){
    let points = []
    for (let i=0; i<times; i++){
      const angle = (i / times) * Math.PI * 2
      const radius = baseRadius
      const randomError = baseRadius * error * Math.random()
      const newPoint = {
        angle: angle,
        r: radius + randomError
      }
      points.push(newPoint)
    }
    return points
  }

  randomEllipsePointsGenerator(times, baseRadius, rotation){
    let points = []
    for (let i=0; i<times; i++){
      const angle = (i / times) * Math.PI * 2
      const radius = (0.5*baseRadius**2) / Math.sqrt(0.25*(baseRadius**2)*(Math.sin(angle + Math.PI * rotation * 2)**2) + (baseRadius**2)*(Math.cos(angle + Math.PI * rotation * 2)**2))
      const randomError = baseRadius * 0.2 * Math.random()
      const newPoint = {
        angle: angle,
        r: radius + randomError
      }
      points.push(newPoint)
    }
    return points
  }

  randomWormPointsGenerator(times, baseRadius, rotation){
    let points = []
    for (let i=0; i<times; i++){
      const angle = (i / times) * Math.PI * 2
      const radius = (0.4*baseRadius**2) / Math.sqrt(0.25*(baseRadius**2)*(Math.sin(angle + Math.PI * rotation * 2)**2) + (baseRadius**2)*(Math.cos(angle + Math.PI * rotation * 2)**2))
      const randomError = baseRadius * 0.2 * Math.random()
      const newPoint = {
        angle: angle,
        r: radius - (0.4 * radius * (Math.sin(9.5 * angle)) )
      }
      points.push(newPoint)
    }
    return points
  }

  shuffleArray(array){
    let m = array.length
    let t, i
    while (m) {
      i = Math.floor(Math.random() * m--)
      t = array[m]
      array[m] = array[i]
      array[i] = t
    }
    return array;
  }

  visited(){
    this.goCrazy()
    this.changeColor()
  }

  changeColor(){
    this.structures
        .membrane
        .attr("fill", "url(#siteRadialGradient)")

    d3.select("#siteRadialGradient")
      .select("#stop_1")
      .transition()
      .duration(500)
      .attr("stop-color", "#FF9E33")
      .on("end", () => {
        d3.select("#siteRadialGradient")
          .select("#stop_1")
          .transition()
          .duration(2000)
          .attr("stop-color", "#c9e9f6")
      })

    d3.select("#siteRadialGradient")
      .select("#stop_2")
      .transition()
      .duration(500)
      .attr("stop-color", "#CE6D00")
      .on("end", () => {
        d3.select("#siteRadialGradient")
          .select("#stop_2")
          .transition()
          .duration(2000)
          .attr("stop-color", "#87ceeb")
      })
  }

  showGroup(group, time = 800, finalOpacity = 1){
    group.attr("display", "block")
         .transition()
         .duration(time)
         .style("opacity", finalOpacity)
  }

  hideGroup(group, time = 800, finalOpacity = 0){
    group.transition()
         .duration(time)
         .style("opacity", finalOpacity)
         .on("end", () => {group.attr("display", "none")})
  }

  goCrazy(){
    const radius = this.state.huge ? this.variables.r * this.invariables.hugeMultiplier : this.variables.r
    const points = this.randomCirclePointsGenerator(this.invariables.membranePointNumber, radius, 1.5)
    this.structures
        .membrane
        .transition()
        .duration(500)
        .ease(d3.easeQuadInOut)
        .attr("d", this.invariables.radialLineGenerator(points))
        .on("end", () => {this.calmDown()})
  }

  calmDown(){
    const radius = this.state.huge ? this.variables.r * this.invariables.hugeMultiplier : this.variables.r
    const points = this.randomCirclePointsGenerator(this.invariables.membranePointNumber, radius)
    this.structures
        .membrane
        .transition()
        .duration(2000)
        .ease(d3.easeQuadInOut)
        .attr("d", this.invariables.radialLineGenerator(points))
        .on("end", () => {
          this.breathe()
          this.structures
              .membrane
              .attr("fill", this.variables.color)
        })
  }

}
