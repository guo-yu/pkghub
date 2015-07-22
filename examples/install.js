var Hub = require('../dist/pkghub')
var hub = new Hub

hub.install('underscore')
  .then(function(err, result) {
    console.log(result)
  })