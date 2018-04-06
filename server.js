const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const jwtAuthz = require('express-jwt-authz');

const checkJwt = require("./middlewares/authMiddleware.js");
const checkScopes = jwtAuthz(['read:messages']);


// loading environment variables
require('dotenv')
    .config();

// using middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// serving static content
app.use(express.static(__dirname + '/public'));

// routing for api
app.use('/api/' + process.env.API_VERSION, require('./controllers'));

app.get('/', function(req, res){
    res.json({"message":"working"});
});

app.get('/public_test', function(req, res){
    res.json({"message":"public test working"});
});

app.get('/private_test', checkJwt, function(req, res){
    res.json({"message":"private test working"});
});

app.get('/private_scope_test', checkJwt, checkScopes, function(req, res){
    res.json({"message":"private scope test working"});
});

var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
    console.log('Listening on port ' + port + '...');
});
