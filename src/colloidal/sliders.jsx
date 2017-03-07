const d3 = require('d3')

export const drawSliders = (menuSelect, slidersSelect, infoMenu, particleClasses, classesMatrix, w) => {
  addSliders(slidersSelect, particleClasses, classesMatrix, w)
  menuListener(infoMenu)
}

const addSliders = (slidersSelect, particleClasses, classesMatrix, w) => {
  const slidersContainer = d3.select(slidersSelect)
  particleClasses.map( (particleClass1, idx1) => {
    const row = slidersContainer.append("div")
                                .attr("class", "gravity-slider_row")
    particleClasses.map( (particleClass2, idx2) => {
      const width = Math.floor((w - 70) / particleClasses.length) * 0.5 + "px"

      const div = row.append("div")
                     .style("display", "inline-block")
                     .attr("width", width)

      const slider = div.append("input")
                        .attr("class", "gravity-slider")
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

const menuListener = (infoMenu) => {
  let menuVisible = false
  d3.select(hamburg_menu).on("click", () => {
    if(menuVisible){
      d3.select(infoMenu)
        .style("display", "none")
    }else{
      d3.select(infoMenu)
        .style("display", "block")
    }
    menuVisible = !menuVisible
  })
}
