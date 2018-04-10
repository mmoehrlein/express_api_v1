const bunyan = require('bunyan');
const log = bunyan.createLogger({name:"api"});

module.exports= log;