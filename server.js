const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const JwtCookieComboStrategy = require('passport-jwt-cookiecombo');
const LocalStrategy = require('passport-local');


// loading environment variables
require('dotenv')
    .config();

// using middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Pass a secret to sign the secured http cookie
app.use(cookieParser(process.env.JWT_SECRET));

//passport strategy configs
passport.use(new JwtCookieComboStrategy({
    secretOrPublicKey: process.env.JWT_SECRET,
    jwtVerifyOptions: process.env.JWT_OPTIONS,
    passReqToCallback: false
}, function(payload, done){
    return done(null, payload.user);
}));

passport.use(new LocalStrategy({session: false},
    function(username, password, done){
        User.findOne({
                email: username
            })
            // Explicitly select the password when the model hides it
            .select('password role')
            .exec(function(err, user){
                if(err){
                    return done(err);
                }

                // Copy the user w/o the password into a new object
                if(user && user.verifyPassword(password)){
                    return done(null, {
                        id: user._id,
                        role: user.role
                    });
                }

                return done(null, false);
            });
    }));


// serving static content
app.use(express.static(__dirname + '/public'));

// routing for api
app.use('/api/' + process.env.API_VERSION, require('./controllers'));

app.get('/', function(req, res){
    res.json({"message": "working"});
});

app.get('/public_test', function(req, res){
    res.json({"message": "public test working"});
});

app.get('/private_test', passport.authenticate('jwt-cookiecombo', {
    session: false
}), function(req, res){
    res.json({"message": "private test working"});
});

app.get('/private_scope_test', passport.authenticate('jwt-cookiecombo', {
    session: false
}), function(req, res){
    res.json({"message": "private scope test working"});
});

var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
    console.log('Listening on port ' + port + '...');
});
