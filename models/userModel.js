//DB client
const mongoose = require('mongoose');

//logging
const log = require('../helpers/loggingHelper');

//miscellaneous
const bcrypt = require('bcryptjs');

//creating new User Schema
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
        set: toLower,
        default: []
    }],
    roles: [{
        type: String,
        set: toLower,
        default: ["user"]
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

//converts String to all lower case
function toLower(s){
    return s.toLowerCase();
}

//checks if entered Mail is valid
function checkValidMail(mail){
    var mailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return mailRegEx.test(mail);
}

//create model from schema
var user = module.exports = mongoose.model('User', userSchema);

//add function to model
module.exports.createUser = function(newUser, callback){
    //check if user with name or email already exists
    user.findOne({$or: [{username: newUser.username}, {email: newUser.email}]})
           .exec(function(err, result){
               if(err){
                   throw err;
               }

               //if a user is found return with error
               if(result){
                   log.info({existing_user: result}, 'Username or Email is already in use');
                   return callback(null, false, 'Username or Email is already in use');
               }

               //if user is not found, hash the password and create new document
               bcrypt.genSalt(10, function(err, salt){
                   bcrypt.hash(newUser.password, salt, function(err, hash){
                       newUser.password = hash;
                       newUser.save(callback);
                   });
               });
           });
};