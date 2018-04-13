//express basics
const express = require('express');
const router = express.Router();

//authentication
const passport = require('passport');

//routing to controllers
router.use('/users', require('./usersController'));
router.use('/tests', passport.authenticate('jwt-cookiecombo', {
    session: false
}), function(req, res, next){
    if(req.user.active){
        return next();
    }else {
        res.json({"error": "user needs to be activated"});
    }
}, require('./testsController'));

//TODO status  route
router.get('/', function(req, res){
    res.json({"message": "api index"});
});

module.exports = router;
