var npm = require("./npm"),
    _ = require('underscore'),
    utils = require('./utils'),
    finder = require('./finder'),
    settings = require('./settings');

var Hub = function(devider) {
    this.settings = _.clone(settings);
    if (devider) this.settings.devider = devider;
};

// 配置分隔符
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

Hub.prototype.keywords = function(shortcut, name) {
    var devider = this.settings.devider;
    var shortcuts = {
        '__pkghub_plugins': name + devider,
        '__pkghub_themes': name + devider + 'theme' + devider
    }
    return shortcuts[shortcut];
}

// 加载某一个模块
// 模块名称可以是全名，也可以是部分名
// 模块名称可以包涵名称和子文件，比如 candy 或 candy/template.html
// e.g: name = 'candy/tpl.html', file === tpl.html;
Hub.prototype.load = function(name, callback) {
    var self = this;
    return this.list(function(err, modules) {
        if (err) return callback(err);
        if (!modules.dependencies) return callback(null, null);
        var module = modules.dependencies[name];
        // 如果完全匹配，返回模块信息
        if (module) return callback(null, module);
        var pkgname = finder.pkgname(name);
        if (pkgname) {
            var m = modules.dependencies[pkgname] || null;
            if (!m || !m.realPath) return callback(null, m);
            return callback(null, m, finder.read(m.realPath, finder.file(name)));
        }
        // 如果找不到 / 而且不匹配任何模块，进行搜索
        var result = {};
        var keyword = self.keywords(name, modules.name) || name;
        Object.keys(modules.dependencies).forEach(function(name) {
            if (name.indexOf(keyword) > -1) result[name] = modules.dependencies[name];
        });
        if (_.isEmpty(result)) return callback(null, null);
        var availables = Object.keys(result);
        if (availables.length === 1) return callback(null, result[availables[0]])
        return callback(null, result);
    });
};

// 返回一个模块的插件列表
// 某个包的插件是以 devider 分割的模块名字
// e.g: candy-editor 是 candy 的插件，此例中，插件包涵 `cady-` 字符串
Hub.prototype.plugins = function(callback) {
    return this.load('__pkghub_plugins', callback);
};

// 返回一个模块的主题列表
// e.g:  candy-theme-balbala 会被返回
Hub.prototype.themes = function(callback) {
    return this.load('__pkghub_themes', callback);
};

// 安装一个包，并返回所有依赖
Hub.prototype.install = function(modules, callback, dir) {
    var self = this;
    if (_.isString(modules)) modules = [modules];
    return npm.install(dir, modules, function(err, logs) {
        if (err) return callback(err);
        return self.list(function(err, modules) {
            callback(err, logs, modules);
        });
    });
};

exports = module.exports = Hub;