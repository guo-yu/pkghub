var Hub = require('../dist/pkghub')
var hub = new Hub

hub.load('underscore')
  .then(function(result) {
    console.log(result.version)
  })
