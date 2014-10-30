var Hub = require('../index');
var hub = new Hub;

hub.install('underscore', function(err, result) {
  console.log(result)
});