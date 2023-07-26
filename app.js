const Logger = require("./logger");

const logger = new Logger();
logger.on('messagelogged',(arg)=>{
    console.log(arg,"Its get listened");
});

logger.log("Dipesh");
