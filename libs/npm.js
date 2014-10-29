var npm = require("npm");
var _ = require('underscore');

var config = {};
config.loglevel = 'silent';
config.parseable = true;
// config.disturl = 'http://dist.u.qiniudn.com';
// config.registry = 'http://r.cnpmjs.org';

exports.ls = ls;
exports.load = load;
exports.install = install;

function load(callback) {
  return npm.load(config, callback);
}

function ls(callback) {
  return exports.load(function(err, npm) {
    if (err) 
      return callback(err);

    return npm.commands.ls([], true, callback);
  });
}

function install(dir, modules, callback) {
  if (!_.isArray(modules)) 
    return callback(new Error('modules name must be array'));

  return exports.load(function(err, npm) {
    if (err) 
      return callback(err);

    if (!dir) 
      return npm.commands.install(modules, callback);

    return npm.commands.install(dir, modules, callback);
  });
}
