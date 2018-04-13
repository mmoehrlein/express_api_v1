//express basics
const express = require('express');
const router = express.Router();

//routing to controllers
router.use('/users', require('./usersController'));

//TODO status  route
router.get('/', function(req, res){
    res.json({"message": "api index"});
});

module.exports = router;
