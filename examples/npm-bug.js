var npm = require('npm')

var config = {};
config.loglevel = 'silent';
config.parseable = true;

npm.load(config, function(err, n) {
  console.log(n.prefix);
  console.log(n.dir);
  console.log(n.cache);
  n.commands.ls([], true, function(err, module, tree) {
    console.log(tree);
  });
  n.commands.ls([], true, function(err, module, tree) {
    console.log(tree);
  });
});