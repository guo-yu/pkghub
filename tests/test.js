var should = require('should')
var sys = require('../package.json')
var Hub = require('../index')
var hub = new Hub

describe('#List', function() {
  it('should return a module list', function(done) {
    hub.list(function(err, modules) {
      if (err) 
        return console.log(err)

      // 无法 parse 依赖模块？
      modules.should.be.an.Object
      modules.name.should.equal(sys.name)
      modules.version.should.equal(sys.version)
      modules.dependencies.should.have.property('underscore')
      modules.dependencies.underscore.should.not.be.empty

      done(err)
    })
  })
})
