var npm = require('../dist/npm')

npm.ls().then(function(m, p) {
  console.log(p)
  console.log(m.dependencies)
})
