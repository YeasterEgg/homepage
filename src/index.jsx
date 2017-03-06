const modules = {
  yeast: require ('./yeasts.jsx'),
  gravity: require ('./gravity.jsx'),
  chaos: require ('./chaos.jsx')
}

const startAnimation = () => {
  const currentEnv = document.body.id
  modules[currentEnv].startAnimation()
}

document.addEventListener('DOMContentLoaded', startAnimation)
