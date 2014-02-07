var Hub = require('../index'),
    hub = new Hub;

hub.plugins(function(err, result){
    console.log(result);
});