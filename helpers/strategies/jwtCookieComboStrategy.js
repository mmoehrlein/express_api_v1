//strategy
const JwtCookieComboStrategy = require('passport-jwt-cookiecombo');

//environment variables
const JWT_SECRET = process.env.JWT_SECRET;

//configure strategy
var jwtCookieComboStrat = new JwtCookieComboStrategy({secretOrPublicKey: JWT_SECRET},
    function(payload, done){
        return done(null, payload.user);
    });

module.exports = jwtCookieComboStrat;