var Hub = require('../dist/pkghub')
var hub = new Hub

hub.plugins().then(function(result) {
  console.log(result)
})