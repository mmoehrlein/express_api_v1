//express basics
const express = require('express');
const router = express.Router();

//routing to controllers
router.use('/users', require('./usersController'));
//router.use('/dormip', require('./dormIpController'));
//router.use('/slides', require('./slidesController'));


//TODO implemnt general info route
router.get('/', function(req, res){
    res.json({"message":"api index"});
});

module.exports = router;
