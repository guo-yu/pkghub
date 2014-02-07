var Hub = require('../index'),
    hub = new Hub;

hub.list(function(err, modules) {
    if (err) return console.log(err);
    console.log(modules);
});
