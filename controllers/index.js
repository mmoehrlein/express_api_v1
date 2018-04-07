const express = require('express');
const router = express.Router();


router.use('/users', require('./usersController'));
//router.use('/dormip', require('./dormIpController'));
//router.use('/slides', require('./slidesController'));

router.get('/', function(req, res){
    res.json({"message":"api index"});
});

module.exports = router;
