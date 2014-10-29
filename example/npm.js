var npm = require('../libs/npm');

npm.ls(function(err, m, p) {
    console.log('==1======================')
    // console.log(m.dependencies.underscore);
    console.log(p)
    console.log('=========================')
});

npm.ls(function(err, m, p) {
    console.log('==2=======================')
    console.log(err);
    console.log(m.dependencies.underscore);
    console.log(p)
    console.log('=========================')
});

npm.ls(function(err, m, p) {
    console.log('==3=======================')
    console.log(err);
    console.log(m.dependencies.underscore);
    console.log(p)
    console.log('=========================')
});