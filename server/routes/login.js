// Modules
var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();

router.post('/', passport.authenticate('local'), function(req, res) {
    res.sendStatus(200);
});

module.exports = router;
