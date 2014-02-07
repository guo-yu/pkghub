var fs = require('fs'),
    Hub = require('../index'),
    hub = new Hub;

hub.list(function(err, modules){
    if (err) return console.log(err);
    return fs.writeFileSync( __dirname + '/data.json', JSON.stringify(modules));
});