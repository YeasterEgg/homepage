const modules = {
  yeast: require ('./yeasts.jsx'),
  gravity: require ('./gravity.jsx'),
  colloidal: require ('./colloidal.jsx'),
}

const startAnimation = () => {
  const currentEnv = document.body.id
  modules[currentEnv].startAnimation()
}

document.addEventListener('DOMContentLoaded', startAnimation)
