const d3 = require('d3')
const io = require('socket.io-client')

const Yeast = require ('./yeasts/yeast_class.jsx').Yeast
const addDefs = require ('./yeasts/defs.jsx').addDefs
const addLegend = require ('./yeasts/legend.jsx').drawLegend

const socket = io()
const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
const screenRatio = w / h
const yeastRadius = Math.floor(Math.min(w,h) / 10)

let population = {}
const colors = {
  "JavaScript": "url(#blueLinearGradient)",
  "Python": "url(#redLinearGradient)",
  "Ruby": "url(#greenLinearGradient)",
  "CSS": "url(#yellowLinearGradient)",
  "HTML": "url(#greyLinearGradient)",
  "None": "white",
}

const adamHash = {
  w: w,
  h: h,
  r: yeastRadius * 1.3,
  x: w / 2,
  y: h / 2,
  color: "url(#radialGradient)",
  title: "Luca Mattiazzi",
  git: "https://github.com/YeasterEgg",
  url: "https://www.linkedin.com/in/mattiazziluca",
  header: "Currently interested in:",
  description: ["Molecular Dynamics", "Backend Development", "Biotechnology", "Data Science", "Bioinformatics", "Neural Networks", "Data Visualization"],
  genome: {},
  first: true,
  name: "luca",
  colorPalette: colors
}

const yeastHash = (websiteData, position) => {
  return {
    w: w,
    h: h,
    r: yeastRadius,
    x: w / 2 + position.x,
    y: h / 2 + position.y,
    color: "url(#lightRadialGradient)",
    title: websiteData.name,
    git: websiteData.git,
    url: websiteData.url,
    header: "Technologies used:",
    description: websiteData.languages,
    genome: websiteData.ratios,
    first: false,
    name: websiteData.name,
    colorPalette: colors
  }
}

export const drawWebsites = (websites) => {
  const container = d3.select("#yeast")
                      .append("svg")
  const svg = container.attr("width", w+"px")
                       .attr("height", h+"px")
                       .append("g")
                       .style("filter", "url(#gooey)")

  addLegend(container, colors, population)
  addDefs(svg)

  const adam = new Yeast(adamHash)
  adam.birth(svg, population)
  const websitesLength = websites.length

  websites.map( (website, i) => {
    const angle = Math.PI * 2 * (i + 1) / websitesLength
    const position = {
      x: yeastRadius * (Math.random() * 2 + w / (yeastRadius * 4)) * Math.cos(angle),
      y: yeastRadius * (Math.random() * 2 + h / (yeastRadius * 4)) * Math.sin(angle),
    }
    const webHash = yeastHash(website, position)
    setTimeout( () => {
      const webYeast = new Yeast(webHash)
      webYeast.birth(svg, population)
    }, Math.random() * 400)
  })
}

socket.on('connect', function() {
  socket.on('website_visited', function(data){
    const yeast = population[data.website]
    yeast.visited()
  })
})
