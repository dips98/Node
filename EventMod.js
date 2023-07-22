const EventEmmiters = require('events');
const emmiter = new EventEmmiters();
console.log(emmiter);

emmiter.on('messagelogged',function(){
    console.log("Its get listened");
});

emmiter.emit('messagelogged');