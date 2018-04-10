var bcrypt = require('bcryptjs');
const db = require('../helpers/dbMongoHelper');
const mongoose = require('mongoose');
const log = require('../helpers/loggingHelper');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    pic: {
        type: String,
        default: "robohash.org/" + Date.now()
    },
    password: String,
    email: {
        type: String,
        set: toLower,
        validate: checkValidMail
    },
    scopes: [{
        type: String,
        set: toLower
    }],
    roles: [{
        type: String,
        set: toLower
    }],
    active: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});

function toLower(s){
    return s.toLowerCase();
}

function checkValidMail(mail){
    var mailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return mailRegEx.test(mail);
}

var user = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){

    user.findOne({$or: [{username: newUser.username}, {email: newUser.email}]})
           .exec(function(err, result){
               if(err){
                   throw err;
               }

               if(result){
                   log.info({existing_user: result}, 'Username or Email is already in use');
                   return callback(null, false, 'Username or Email is already in use');
               }

               bcrypt.genSalt(10, function(err, salt){
                   bcrypt.hash(newUser.password, salt, function(err, hash){
                       newUser.password = hash;
                       newUser.save(callback);
                   });
               });
           });
};