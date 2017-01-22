const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pg = require('pg');
const db = require('../utils/database/db');
const compare = require('../utils/auth').compare;

passport.use('local', new LocalStrategy({
    passReqToCallback: true
}, function(req, username, password, done) {
    console.log('hit local strategy callback');
    db.users.select.byUserEmail(username, function(user) {
        if (user) {
            compare(password, user.password, function(err, isMatch) {
                if (isMatch) {
                    console.log('Successful login');
                    done(null, user, {
                        message: 'Login Successful'
                    });
                } else {
                    console.log('Bad PW');
                    done(null, false, {
                        message: 'Incorrect Credentials'
                    });
                }
            });
        } else {
            console.log('No user');
            done(null, false, {
                message: 'Incorrect Credentials'
            });
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('Deserializing user');
    db.users.select.byUserId(id, (user) => {
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

module.exports = passport;
