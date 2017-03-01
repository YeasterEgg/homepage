const yeasts = require ('./yeasts.jsx')

const startAnimation = () => {
  fetch("/sites").then( (response) => {
    return response.json()
  }).then( (json) => {
    yeasts.drawWebsites(json.sites)
  })
}

document.addEventListener('DOMContentLoaded', startAnimation)
