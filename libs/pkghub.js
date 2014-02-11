var npm = require("./npm"),
    _ = require('underscore'),
    utils = require('./utils'),
    finder = require('./finder'),
    settings = require('./settings');

var Hub = function(devider) {
    this.settings = _.clone(settings);
    this.module = {};
    this.module.dependencies = {};
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
    return npm.ls(function(err, packages) {
        if (err) return callback(err);
        var modules = _.clone(packages);
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
        self.cached = new Date();
        if (!callback) return;
        return callback(err, modules);
    });
};

Hub.prototype.keywords = function(shortcut, name) {
    var devider = this.settings.devider;
    var shortcuts = {
        '__pkghub_addons': name + devider,
        '__pkghub_plugins': name + devider + 'plugin' + devider,
        '__pkghub_themes': name + devider + 'theme' + devider
    }
    return shortcuts[shortcut];
}

Hub.prototype.find = function(name, modules, callback) {

    // 这里要加一层缓存，不要每次都去 list 一遍模块
    // 因为 npm 有个问题同时调用两次 load list 会报错。
    // 这样的话如果在路由里使用基本不现实

    // 先判断是否完全匹配模块名称
    var pkg = modules.dependencies[name];
    if (pkg) return callback(null, pkg);

    // 分离模块名称和模板名称
    // e.g: candy-theme-default/index => candy-theme-default
    var pkgname = finder.split(name);
    var filename = finder.split(name, 'filename');

    if (pkgname && filename) {
        var m = modules.dependencies[pkgname] || null;
        if (!m || !m.realPath) return callback(null, m);
        return callback(null, m, finder.read(m.realPath, filename));
    }

    // 如果找不到 / 而且不匹配任何模块，进行搜索
    var result = {};
    var keyword = this.keywords(name, modules.name) || name;
    Object.keys(modules.dependencies).forEach(function(name) {
        if (name.indexOf(keyword) > -1) result[name] = modules.dependencies[name];
    });
    if (_.isEmpty(result)) return callback(null, null);
    var availables = Object.keys(result);
    if (availables.length === 1) return callback(null, result[availables[0]])
    return callback(null, result);

}

// 加载某一个模块
// 模块名称可以是全名，也可以是部分名
// 模块名称可以包涵名称和子文件，比如 candy 或 candy/template.html
// e.g: name = 'candy/tpl.html', file === tpl.html;
Hub.prototype.load = function(name, callback, force) {
    var self = this;
    var cache = self.module;
    // 如果有缓存，返回缓存内容，这里还应该判断缓存时间, 比如大于多少天自动更新之类
    // 这里可能出现一个 bug，就是前后查询条件不符合
    // 这样 hub 可能会缓存到不正确的结果
    if (self.cached && !force) return self.find(name, cache, callback);
    // 如果没有缓存，第一次生成缓存
    return this.list(function(err, modules) {
        if (err) return callback(err);
        if (!modules.dependencies) return callback(null, null);
        return self.find(name, modules, callback);
    });
};

// 返回一个模块的相关模块，包括插件和主题
// e.g: candy-editor 是 candy 的插件，此例中，插件包涵 `candy-` 字符串
Hub.prototype.addons = function(callback) {
    return this.load('__pkghub_addons', callback);
};

// 返回一个模块的插件列表
// 某个包的插件是以 devider 分割的模块名字
// e.g: candy-editor 是 candy 的插件，此例中，插件包涵 `candy-plugin` 字符串
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

Hub.prototype.finder = finder;

exports = module.exports = Hub;