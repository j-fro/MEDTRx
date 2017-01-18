var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
var connString = require('../utils/dbUtils');
var compare = require('../utils/auth').compare;

passport.use('local', new LocalStrategy({
    passReqToCallback: true
}, function(req, username, password, done) {
    console.log('hit local strategy callback');
    pg.connect(connString, function(err, client, end) {
        if (err) {
            console.log(err);
        } else {
            client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [username], function(err, result) {
                if (err) {
                    end();
                    console.log(err);
                } else {
                    var user = result.rows[0];
                    end();
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
                }
            });
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('Deserializing user');
    pg.connect(connString, function(err, client, end) {
        if (err) {
            end();
            console.log(err);
            done(null, false);
        } else {
            client.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id], function(err, result) {
                if (err) {
                    end();
                    console.log(err);
                    done(null, false);
                } else {
                    end();
                    done(null, result.rows[0]);
                }
            });
        }
    });
});

module.exports = passport;
