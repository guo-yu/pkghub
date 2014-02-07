var npm = require("./npm"),
    _ = require('underscore'),
    utils = require('./utils'),
    finder = require('./finder'),
    settings = require('./settings');

var Hub = function() {
    this.settings = _.clone(settings);
};

Hub.prototype.config = function(params) {
    if (params) this.settings = _.extend(this.settings, params);
    return this.settings;
};

// 列出所有依赖模块
Hub.prototype.list = function(callback) {
    var self = this;
    return npm.ls(function(err, modules) {
        if (err) return callback(err);
        var dependencies = modules.dependencies;
        if (dependencies) {
            delete modules.dependencies;
            _.each(dependencies, function(module, name) {
                dependencies[name] = utils.wash(module);
            });
        }
        modules = utils.wash(modules);
        modules.dependencies = dependencies;
        self.module = modules;
        if (!callback) return;
        return callback(err, modules);
    });
};

// 返回一个模块的所有信息
Hub.prototype.load = function(name, callback) {
    return this.list(function(err, modules) {
        if (err) return callback(err);
        if (!modules.dependencies) return callback(null, null);
        var pkg = finder.check(name);
        if (!pkg) return callback(err, modules.dependencies[name]);
        return callback(err, modules.dependencies[pkg], finder.read(modules.dependencies[pkg], name));
    });
};

// 搜索带有某些关键词的依赖模块
Hub.prototype.search = function(keyword, callback) {
    var self = this;
    return self.list(function(err, modules) {
        if (err) return callback(err);
        if (!modules.dependencies) return callback(null, null);
        var result = {};
        var k = keyword || modules.name + self.settings.devider;
        Object.keys(modules.dependencies).forEach(function(name){
            if (name.indexOf(k) > -1) result[name] = modules.dependencies[name];
        });
        if (_.isEmpty(result)) return callback(err, null);
        return callback(err, result);
    });
};

// 返回一个模块的插件列表
// 某个包的插件是以 devider 分割的模块名字
// e.g: candy-editor 是 candy 的插件，此例中，插件包涵 `cady-` 字符串
Hub.prototype.plugins = function(callback) {
    return this.search(null, callback);
};

// 返回这个包的某个插件的所有信息
Hub.prototype.plugin = function(name, callback) {
    return this.plugins(function(err, plugins) {
        if (err) return callback(err);
        if (!plugins) return callback(null, null);
        // 检查是否需要加载这个插件文件夹下的某个文件
        // e.g: name = 'candy/tpl.html', file === tpl.html;
        var file = finder.check(name);
        if (!file) return callback(err, plugins[name]);
        return callback(err, plugins[file], finder.read(plugins[file], name));
    });
};

// 安装一个包，并返回所有依赖
Hub.prototype.install = function(modules, callback) {
    var self = this;
    if (_.isString(modules)) modules = [modules];
    return npm.install(modules, function(err, logs) {
        if (err) return callback(err);
        return self.list(function(err, modules) {
            callback(err, logs, modules);
        });
    });
};

exports = module.exports = Hub;