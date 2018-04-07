const mongoose = require('mongoose');

var host = process.env.DB_MONGO_HOST;
var username = process.env.DB_MONGO_USER;
var password = process.env.DB_MONGO_PASSWORD;

host.replace('dbuser', username).replace('dbpassword', password);
mongoose.connect(host);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected');
});

module.exports = db;