var Hub = require('../index'),
    hub = new Hub;

hub.install('underscore', function(err, result) {
    console.log(result)
});