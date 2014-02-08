var npm = require("npm"),
    _ = require('underscore');

exports.load = function(callback) {
    return npm.load({}, callback);
}

exports.ls = function(callback) {
    return exports.load(function(err) {
        if (err) return callback(err);
        return npm.commands.ls([], true, callback);
    });
}

exports.install = function(dir, modules, callback) {
    if (!_.isArray(modules)) return callback(new Error('modules name must be array'));
    return exports.load(function(err) {
        if (err) return callback(err);
        if (!dir) return npm.commands.install(modules, callback);
        return npm.commands.install(dir, modules, callback);
    });
}