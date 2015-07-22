var Hub = require('../dist/pkghub')
var hub = new Hub

hub.load('underscore').then(function(result) {
  console.log(result.version)
})

// force list
setTimeout(function() {
  hub.load('underscore').then(function(result) {
    console.log(result.version)
  })
}, 120)