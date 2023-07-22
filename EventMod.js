const EventEmmiters = require('events');
const emmiter = new EventEmmiters();
console.log(emmiter);

emmiter.on('messagelogged',(arg)=>{
    console.log(arg,"Its get listened");
});

emmiter.emit('messagelogged',{date:10/1/1, name:"Dipesh"});