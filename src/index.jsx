const modules = {
  yeast: require ('./yeasts.jsx'),
  colloidal: require ('./colloidal.jsx'),
  canvas: require ('./canvas.jsx'),
}

const startAnimation = () => {
  const currentEnv = document.body.id
  modules[currentEnv].startAnimation()
}

document.addEventListener('DOMContentLoaded', startAnimation)
