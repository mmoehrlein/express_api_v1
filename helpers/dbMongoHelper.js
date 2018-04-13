//DB client
const mongoose = require('mongoose');

//environment variables
const HOST = process.env.DB_MONGO_HOST;
const USER = process.env.DB_MONGO_USER;
const PASSWORD = process.env.DB_MONGO_PASSWORD;

//connect to db
mongoose.connect(HOST, {
    auth: {
        user: USER,
        password: PASSWORD
    }
});

module.exports = mongoose.connection;