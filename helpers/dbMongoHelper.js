const mongoose = require('mongoose');
var host = process.env.DB_MONGO_HOST;
var username = process.env.DB_MONGO_USER;
var password = process.env.DB_MONGO_PASSWORD;

//host.replace('dbuser', username).replace('dbpassword', password);


mongoose.connect('mongodb://ds235169.mlab.com:35169/mmoehrlein_api_v1', {auth: {
    user: 'api_user_v1',
    password: 'LMg6JyO0BGC2+MRe|h+."JHTCiXJjq'
}});

var db = mongoose.connection;

module.exports = db;