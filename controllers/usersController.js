//express basics
const express = require('express');
const router = express.Router();

//logging
const log = require('../helpers/loggingHelper');

//authentication
const jwt = require('jsonwebtoken');
const passport = require('passport');

//models
const User = require('../models/userModel');

//environment variables
const JWT_SECRET = process.env.JWT_SECRET;

//login route
router.post('/login',
    //using passport middleware to get userdata from database and save to req
    passport.authenticate('local', {session: false}),
    function(req, res){
        //sign jwt token with userdata...
        jwt.sign({
                user: req.user
            },
            //... using the secret from environment
            JWT_SECRET,
            function(err, token){
                if(err){
                    return res.json(err);
                }

                // Send Set-Cookie header
                res.cookie('jwt', token, {
                    httpOnly: true,
                    sameSite: true,
                    signed: true,
                    secure: true
                });

                // Return json web token
                return res.json({
                    jwt: token
                });
            });
    });

router.post('/register', function(req, res){

    log.trace('beginnn register route');

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    if(!(username && email && password)){
        return res.json('Username, email and passowrd are required fields!');
    }

    var newUser = new User({
        username: username,
        password: password,
        email: email
    });

    User.createUser(newUser, function(err, user, msg){
        if(err){
            log.error(err);
            return res.json('user could not be created: ' + err.message);
        }

        if(user){
            user.password = undefined;
            log.info({"user": user}, 'new user has been created');
            return res.json(user);
        }

        res.statusCode = 400;
        return res.json(msg);

    });


});

module.exports = router;