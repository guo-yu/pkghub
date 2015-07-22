var Hub = require('../dist/pkghub')
var hub = new Hub

hub.list().then(function(modules) {
  console.log(modules)
})