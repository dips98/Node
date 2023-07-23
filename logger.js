const EventEmmiters = require("events");


class Logger extends EventEmmiters {
    log(message) {
        console.log("Hello", message);
        this.emit('messagelogged', { name: "Dipesh", Age: 25 });
    }
}

module.exports = Logger;