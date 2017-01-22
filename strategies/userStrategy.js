var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
var db2 = require('../utils/dbUtils');
const db = require('../utils/database/db');
var compare = require('../utils/auth').compare;

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
    //
    // db.connect(function(client, end) {
    //     if (client) {
    //         findUser(username, client, end, function(err, user) {
    //             if (user) {
    //                 compare(password, user.password, function(err, isMatch) {
    //                     if (isMatch) {
    //                         console.log('Successful login');
    //                         done(null, user, {
    //                             message: 'Login Successful'
    //                         });
    //                     } else {
    //                         console.log('Bad PW');
    //                         done(null, false, {
    //                             message: 'Incorrect Credentials'
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 console.log('No user');
    //                 done(null, false, {
    //                     message: 'Incorrect Credentials'
    //                 });
    //             }
    //         });
    //     }
    // });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('Deserializing user');
    db2.connect(function(client, end) {
        if (client) {
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

function findUser(username, client, end, callback) {
    client.query('SELECT * FROM users WHERE email=$1 LIMIT 1', [username], function(err, result) {
        if (err) {
            end();
            callback(err);
        } else {
            var user = result.rows[0];
            end();
            callback(null, user);
        }
    });
}

module.exports = passport;
