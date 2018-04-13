//express basics
const express = require('express');
const router = express.Router();

//Logger
const log = require('../helpers/loggingHelper');

router.get('/', function(req, res){
   res.json('{"hi": "there"}');
});

module.exports = router;