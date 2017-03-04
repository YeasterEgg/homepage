const yeasts = require ('./yeasts.jsx')
const test = require ('./test.jsx')
let startAnimation

const yeastStartAnimation = () => {
  fetch("/sites").then( (response) => {
    return response.json()
  }).then( (json) => {
    yeasts.drawWebsites(json.sites)
  })
}

const testStartAnimation = () => {
  console.log(test)
}

if(document.getElementById("yeast")){
  startAnimation = yeastStartAnimation
}else{
  startAnimation = testStartAnimation
}

document.addEventListener('DOMContentLoaded', startAnimation)
