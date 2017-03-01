const yeasts = require ('./yeasts.jsx')

const startAnimation = () => {
  fetch("/sites").then( (response) => {
    return response.json()
  }).then( (json) => {
    yeasts.drawWebsites(shuffleArray(json.sites))
  })
}

const shuffleArray = (array) => {
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

document.addEventListener('DOMContentLoaded', startAnimation)
