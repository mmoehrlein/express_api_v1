//express basics
const express = require('express');
const app = express();
const http = require('http');

//middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const JwtCookieComboStrategy = require('passport-jwt-cookiecombo');
const LocalStrategy = require('passport-local');

//models
const User = require('./models/userModel');

//miscellaneous
const bcrypt = require('bcryptjs');



// loading environment variables
require('dotenv')
    .config();

const JWT_SECRET = process.env.JWT_SECRET;

// using middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// Pass a secret to sign the secured http cookie
app.use(cookieParser(JWT_SECRET));
app.use(morgan('dev'));
// serving static content
app.use(express.static(__dirname + '/public'));

//passport strategy configs
passport.use(new JwtCookieComboStrategy({
    secretOrPublicKey: JWT_SECRET
}, function(payload, done){
    console.log("here");
    console.log(payload);
    return done(null, payload.user);
}));

passport.use(new LocalStrategy({session: false},
    function(username, password, done){
        User.findOne({
                username: username
            })
            // Explicitly select the password when the model hides it
            .select('password roles scopes active')
            .exec(function(err, user){
                if(err){
                    return done(err);
                }

                if(user){
                    bcrypt.compare(password, user.password, function(err, res){
                        if(err){
                            return done(err);
                        }
                        if(res === true){
                            user.password = undefined;
                            return done(null, user);
                        } else {
                            return done(null, false);

                        }
                    });
                } else {
                    return done(null, false);
                }
            });
    }));


// routing to controllers
app.use('/api/' + process.env.API_VERSION, require('./controllers'));


app.get('/', function(req, res){
    res.json({
        "message": "working",
        "env": process.env
    });
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
