var Hub = require('../index'),
    hub = new Hub;

hub.search('under', function(err, result){
    console.log(result);
});