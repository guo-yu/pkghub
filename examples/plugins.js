var Hub = require('../index');
var hub = new Hub;

hub.plugins(function(err, result) {
  console.log(result);
});