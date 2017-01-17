var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
var connString = require('../utils/dbUtils');
var compare = require('../utils/auth').compare;

passport.use('local', new LocalStrategy({
    passReqToCallback: true
}, function(req, username, password, done) {
    console.log('hit local strategy callback');
    pg.connect(connString)
    .then(function(client) {
        client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [username])
        .then(function(result) {
            user = result.rows[0];
            if(user) {
                console.log('User:', user);
                compare(password, user.password, function(err, isMatch) {
                    if (isMatch) {
                        console.log('Successful login');
                        done(null, user, {
                            message: 'Login Successful'
                        });
                    } else {
                        console.log('bad pw');
                        done(null, false, {
                            message: 'Incorrect credentials'
                        });
                    }
                });
            } else {
                console.log('no user');
                done(null, false, {
                    message: 'Incorrect credentials'
                });
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    })
    .catch(function(error) {
        console.log(error);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    pg.connect(connString)
    .then(function(client) {
        client.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id])
        .then(function(result) {
            done(null, result.rows[0]);
        })
        .catch(function(error) {
            console.log(error);
            done(null, false);
        });
    })
    .catch(function(error) {
        console.log(error);
        done(null, false);
    });
});

module.exports = passport;
