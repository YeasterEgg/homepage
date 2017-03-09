const d3 = require('d3')

export const drawSliders = (world) => {
  addSliders(world.particleClasses, world.classesMatrix, world.w)
  menuListener()
}

const addSliders = (particleClasses, classesMatrix, w) => {
  const slidersContainer = d3.select(".colloidal-sliders_container")
  particleClasses.map( (particleClass1, idx1) => {
    const row = slidersContainer.append("div")
                                .attr("class", "colloidal-slider_row")
    particleClasses.map( (particleClass2, idx2) => {
      const width = Math.floor((w - 70) / particleClasses.length) * 0.45 + "px"

      const div = row.append("div")
                     .style("display", "inline-block")
                     .attr("width", width)
                     .attr("class", "colloidal-slider_container")

      const slider = div.append("input")
                        .attr("class", "colloidal-slider")
                        .attr("type", "range")
                        .attr("min", "-1")
                        .attr("max", "1")
                        .attr("step", "0.01")
                        .attr("value", classesMatrix[idx1][idx2])
                        .style("width", width)

      div.append("hr")
         .style("width", "95%")
         .style("height", "5px")
         .style("margin", "0px auto")
         .style("background-image", "linear-gradient(to right, " + particleClass1.color + " 0%, " + particleClass1.color + " 50%, " + particleClass2.color + " 50%, " + particleClass2.color + " 100%)")

      slider.on("input", () => {onChange(slider, idx1, idx2, classesMatrix)})
    })
  })
}

const onChange = (slider, idx1, idx2, classesMatrix) => {
  classesMatrix[idx1][idx2] = slider.property("value")
}

const menuListener = () => {
  let menuVisible = false
  const sliderMenu = d3.select(".colloidal-menu_container")
  d3.select(".colloidal-hamburg_menu").on("click", () => {
    if(menuVisible){
      sliderMenu.transition()
                .duration(300)
                .style("opacity", 0)
                .on("end", () => {
                  sliderMenu.style("display", "none")
                })
    }else{
      sliderMenu.style("display", "block")
                .transition()
                .duration(300)
                .style("opacity", 1)
    }
    menuVisible = !menuVisible
  })

  d3.select(".colloidal-menu_closebutton").on("click", () => {
    if(menuVisible){
      sliderMenu.transition()
                .duration(300)
                .style("opacity", 0)
                .on("end", () => {
                  sliderMenu.style("display", "none")
                })
      }
    menuVisible = !menuVisible
  })
}
