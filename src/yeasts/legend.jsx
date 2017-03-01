const d3 = require('d3')

export const drawLegend = (container, colors, yeasts) => {
  const legend = container.append("g")
                          .selectAll("g")
                          .data(Object.keys(colors))
                          .enter()
                          .append("g")
                          .attr("id", (d) => { return "legend--circle_" + d })

  const coloredCircles = legend.append("circle")
                               .attr("r", 20)
                               .attr("cx", 25)
                               .attr("cy", (d, i) => { return (40 + 45*i) })
                               .attr("fill", (d) => {return colors[d]})

  legend.append("text")
        .attr("x", 45)
        .attr("y", (d, i) => { return (45 + 45*i) })
        .text((d) => {return d})

  coloredCircles.on("mouseover", (d) => { showLegend(d, true) } )
  coloredCircles.on("mouseout", (d) => { showLegend(d, false) } )
  coloredCircles.on("click", (d) => { clickedLegend(d) } )
}

const showLegend = (d) => {
  d3.select("legend--circle_" + d)
    .append("text")
    .attr("text", "stocazzo")
}

const clickedLegend = (gene) => {
  if(gene == "None"){
    d3.selectAll(".yeast--group")
      .transition()
      .duration(400)
      .style("opacity", 0.6)
    d3.selectAll(".yeast--group_first")
      .transition()
      .duration(400)
      .style("opacity", 1)
  }else{
    d3.selectAll(".yeast--group")
      .transition()
      .duration(400)
      .style("opacity", 0.6)
    d3.selectAll(".yeast--group_"+gene)
      .transition()
      .duration(400)
      .style("opacity", 1)
  }
}
