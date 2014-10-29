var fs = require('fs');
var path = require('path');
var glob = require('glob');

exports.split = split;
exports.read = read;

function split(name, isFilename) {
  if (!name) 
    return false;
  if (name.indexOf('/') === -1) 
    return false;
  if (!isFilename) 
    return name.substr(0, name.indexOf('/'));

  return name.substr(name.indexOf('/') + 1);
}

// 使用 glob 模糊匹配
function read(abs, name) {
  if (!abs) 
    return null;

  var dir = path.join(abs, name);
  var file = {
    name: name,
    dir: dir,
    exist: fs.existsSync(dir)
  };

  if (file.exist) 
    return file;

  try {
    file.availables = glob.sync(file.dir + '*');
  } catch (err) {
    file.err = err;
  }

  return file;
};
