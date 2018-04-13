// loading environment variables
require('dotenv')
    .config();

//environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

//express basics
const express = require('express');
const app = express();
const http = require('http');

//middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');

//strategies
const JwtCookieComboStrategy = require('./helpers/strategies/jwtCookieComboStrategy');
const LocalStrategy = require('./helpers/strategies/localStrategy');

// using middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Pass a secret to sign the secured http cookie
app.use(cookieParser(JWT_SECRET));
app.use(morgan('dev'));

// serving static content
app.use(express.static(__dirname + '/public'));

//using passport strategy
passport.use(JwtCookieComboStrategy);
passport.use(LocalStrategy);

// routing to controllers
app.use('/api/' + process.env.API_VERSION, require('./controllers'));

//Starting server
app.set('port', PORT);
var server = http.createServer(app);
server.listen(PORT, function(){
    console.log('Listening on port ' + PORT + '...');
});
