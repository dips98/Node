const Logger = require("./logger");
const EventEmmiters = require('events');
const emmiter = new EventEmmiters();

const logger = new Logger();
logger.on('messagelogged',(arg)=>{
    console.log(arg,"Its get listened");
});

logger.log("Dipesh");
