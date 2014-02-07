// 执行各个功能点测试
var should = require('should'),
    sys = require('../package.json'),
    Hub = require('../index'),
    hub = new Hub;

describe('#List', function() {
    it('should return a available list', function(done) {
        hub.list(function(err, modules){
            if (err) return console.log(err);
            modules.should.be.an.instanceof(Object);
            modules.name.should.eql(sys.name);
            modules.version.should.eql(sys.version);
            done(err);
        });
    });
});