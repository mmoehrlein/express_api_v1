//express basics
const express = require('express');
const router = express.Router();

//authentication
const passport = require('passport');

//middleware
const checkActive = require('../middlewares/checkActiveMiddleware');

//routing to controllers
router.use('/users', require('./usersController'));

router.use('/', passport.authenticate('jwt-cookiecombo', {
    session: false
}), checkActive);
router.use('/tests', require('./testsController'));

//TODO status  route
router.get('/', function(req, res){
    res.json({"message": "api index"});
});

module.exports = router;
