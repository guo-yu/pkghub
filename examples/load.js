var Hub = require('../index');
var hub = new Hub;

hub.load('underscore', function(err, result) {
  console.log('EX: 1')
  console.log(result.version);
});

// force list
setTimeout(function() {
  hub.load('underscore', function(err, result) {
    console.log('EX: 2')
    console.log(result.version);
  });
}, 120)