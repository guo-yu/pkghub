var Hub = require('../index'),
    hub = new Hub;

hub.search('o', function(err, result){
    console.log(Object.keys(result));
});

setTimeout(function(){
    hub.search('under', function(err, result){
        if (!result) return console.log(result);
        console.log(Object.keys(result));
    });    
},100);
