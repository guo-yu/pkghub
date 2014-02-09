var fs = require('fs'),
    path = require('path'),
    glob = require('glob');

// 获取 / 前的模块名
exports.pkgname = function(name) {
    if (!name) return false;
    if (name.indexOf('/') === -1) return false;
    return name.substr(0, name.indexOf('/'));
};

// 获取 / 后的文件名
exports.file = function(name) {
    if (!name) return false;
    if (name.indexOf('/') === -1) return false;
    return name.substr(name.indexOf('/') + 1);
};

// 使用 glob 模糊匹配
exports.read = function(abs, name) {
    if (!abs) return null;
    var dir = path.join(abs, name);
    var file = {
        name: name,
        dir: dir,
        exist: fs.existsSync(dir)
    };
    if (file.exist) return file;
    try {
        file.availables = glob.sync(file.dir + '*');
    } catch (err) {
        file.err = err;
    }
    return file;
};