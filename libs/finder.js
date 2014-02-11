var fs = require('fs'),
    path = require('path'),
    glob = require('glob');

exports.split = function(name, isFilename) {
    if (!name) return false;
    if (name.indexOf('/') === -1) return false;
    if (!isFilename) return name.substr(0, name.indexOf('/'));
    return name.substr(name.indexOf('/') + 1);
}

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