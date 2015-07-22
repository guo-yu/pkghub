import should from 'should'
import pkg from '../package.json'
import * as npm from '../dist/npm'
import Hub from '../dist/pkghub'

var hub = new Hub

describe('npm', () => {
  it('#load: should return a npm instance', done => {
    npm.load().then(n => {
      n.should.be.an.Object
      done()
    })
    .catch(done)
  })
  it('#ls: should list modules', done => {
    npm.ls().then(modules => {
      modules.homepage.should.equal('https://github.com/turingou/pkghub#readme')
      done()
    }).catch(done)
  })
  it('#install: should install a new module', function(done) {
    this.timeout(8000)
    npm.install(['debug']).then(result => {
      done()
    }).catch(done)
  })
  it('#install: should NOT install a unexist module', function(done) {
    this.timeout(8000)
    npm.install(['some-module-unexist-2712jw72']).then(result => {
      done(new Error('WFT?!'))
    }).catch(err => done())
  })
})

describe('pkghub', function() {
  it('#list: should return a module list', function(done) {
    hub.list()
      .then(function(modules) {
        modules.should.be.an.Object
        modules.name.should.equal(pkg.name)
        modules.version.should.equal(pkg.version)
        modules.dependencies.should.have.property('underscore')
        modules.dependencies.underscore.should.not.be.empty
        done()
      })
      .catch(done)
  })
  it('#install: should install a new module and return a list', function(done) {
    this.timeout(8000)
    hub.install('debug').then(result => {
      result.dependencies.debug.should.be.an.Object
      done()
    }).catch(done)
  })
  it('#install: should NOT install a unexist module', function(done) {
    this.timeout(8000)
    hub.install(['some-module-unexist-2712jw72']).then(result => {
      done(new Error('WFT?!'))
    }).catch(err => done())
  })
  it('#load: should load a exist module', done => {
    hub.load('debug').then(result => {
      result.name.should.equal('debug')
      done()
    }).catch(done)
  })
  it('#load: should NOT load a unexist module', done => {
    hub.load('some-module-not-exist').then(result => {
      done(new Error('WFT?!'))
    }).catch(err => done())
  })
})
