// 执行各个功能点测试
var should = require('should'),
    sys = require('../package.json'),
    Hub = require('../index'),
    hub = new Hub;

describe('#List', function() {
    it('should return a module list', function(done) {
        hub.list(function(err, modules){
            if (err) return console.log(err);
            // 无法 parse 依赖模块？
            console.log(modules.dependencies)
            modules.should.be.an.Object;
            modules.name.should.equal(sys.name);
            modules.version.should.equal(sys.version);
            modules.dependencies.should.have.property('underscore');
            modules.dependencies.underscore.should.not.be.empty;
            done(err);
        });
    });
});