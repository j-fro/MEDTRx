const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const compare = require('../utils/auth').compare;
const knex = require('../utils/database');

passport.use('local', new LocalStrategy({passReqToCallback: true}, function(
    req,
    username,
    password,
    done
) {
    console.log('hit local strategy callback');
    knex.select().from('users').where('email', username).then(user => {
        if (user) {
            user = user[0];
            compare(password, user.password, function(err, isMatch) {
                if (isMatch) {
                    console.log('Successful login');
                    done(null, user, {message: 'Login Successful'});
                } else {
                    console.log('Bad PW');
                    done(null, false, {message: 'Incorrect Credentials'});
                }
            });
        } else {
            console.log('No user');
            done(null, false, {message: 'Incorrect Credentials'});
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('Deserializing user');
    knex.select().from('users').where('id', id).then(user => {
        user ? done(null, user[0]) : done(null, false);
    });
});

module.exports = passport;
