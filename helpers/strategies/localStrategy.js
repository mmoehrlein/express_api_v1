//strategy
const LocalStrategy = require('passport-local');

//models
const User = require('../../models/userModel');

//DB connection -- needed to be called so connection is active
const db = require('../dbMongoHelper');

//miscellaneous
const bcrypt = require('bcryptjs');

//configure strategy
var localStrat = new LocalStrategy({session: false},
    function(username, password, done){
        User.findOne({
                username: username
            })
            // Explicitly select the password when the model hides it
            .select('password roles scopes active')
            .exec(function(err, user){
                if(err){
                    return done(err);
                }

                if(user){
                    //check if password matches
                    bcrypt.compare(password, user.password, function(err, res){
                        if(err){
                            return done(err);
                        }
                        if(res === true){
                            user.password = undefined;
                            return done(null, user);
                        } else {
                            return done(null, false);

                        }
                    });
                } else {
                    return done(null, false);
                }
            });
    });

module.exports = localStrat;