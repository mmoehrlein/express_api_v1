const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/login', passport.authenticate('local'), function(req, res){
    jwt.sign({user: req.user}, process.env.JWT_SECRET, function(err, token){
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

module.exports = router;