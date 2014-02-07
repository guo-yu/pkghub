var Hub = require('../index'),
    hub = new Hub;

hub.load('underscore', function(err, result) {
    console.log(result)
});