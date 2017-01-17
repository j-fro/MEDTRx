var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
var connString = require('../utils/dbUtils');
var compare = require('../utils/auth').compare;

passport.use('local', new LocalStrategy({
    passReqToCallback: true
}, function(req, username, password, done) {
    console.log('hit local strategy callback');
}));

module.exports = passport;
