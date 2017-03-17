const modules = {
  yeast: require ('./yeasts.jsx'),
}

const startAnimation = () => {
  const currentEnv = document.body.id
  modules[currentEnv].startAnimation()
}

document.addEventListener('DOMContentLoaded', startAnimation)
