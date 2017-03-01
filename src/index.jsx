const yeasts = require ('./yeasts.jsx')

const startAnimation = () => {
  let drawWebsites
  if(document.getElementById("yeast") != undefined){
    drawWebsites = yeasts.drawWebsites
  }else if(document.getElementById("agar") != undefined){
    drawWebsites = agar.drawWebsites
  }else{
    drawWebsites = (websites) => {
      console.log("Nulla")
      console.log(websites)
    }
  }
  fetch("/sites").then( (response) => {
    return response.json()
  }).then( (json) => {
    drawWebsites(json.sites)
  })
}

document.addEventListener('DOMContentLoaded', startAnimation)
