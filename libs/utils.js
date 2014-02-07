var settings = require('./settings');

// 清理 npm 返回的包信息中不需要的部分
exports.wash = function(obj) {
    var washed = {};
    settings.includes.forEach(function(key){
        if (obj[key]) washed[key] = obj[key];
    });
    return washed;
};