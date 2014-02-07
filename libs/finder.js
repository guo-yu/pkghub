var fs = require('fs'),
    path = require('path'),
    glob = require('glob');

var finder = {
    check: function(name) {
        if (name && name.indexOf('/') > -1) return name.substr(0, name.indexOf('/'));
        return false;
    },
    filename: function(name) {
        return name.substr(name.indexOf('/') + 1);
    },
    read: function(pkg, filename) {
        if (!pkg) return null;
        var name = this.filename(filename);
        var dir = path.join(pkg.realPath, name);
        var file = {
            name: name,
            dir: dir,
            exist: fs.existsSync(dir)
        };
        // 使用 glob 模糊匹配
        if (file.exist) return file;
        try {
            file.availables = glob.sync(file.dir + '*');
        } catch (err) {
            file.err = err;
        }
        return file;
    }
}

exports = module.exports = finder;
