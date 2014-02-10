var npm = require("npm");

var config = {};
config.loglevel = 'silent';
config.parseable = true;

npm.load(config, function() {
    npm.commands.ls([], true, function(err, module, tree){
        console.log(tree);
    });
    npm.commands.ls([], true, function(err, module, tree){
        console.log(tree);
    });
});