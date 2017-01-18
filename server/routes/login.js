// Modules
var express = require('express');
var path = require('path');
var passport = require('passport');
var auth = require('../../utils/auth');
var router = express.Router();

router.get('/', auth.checkIfAuthenticated, function(req, res) {
    res.sendStatus(200);
});

router.post('/', passport.authenticate('local'), function(req, res) {
    // res.sendStatus(200);
    res.redirect('/');
});

module.exports = router;
