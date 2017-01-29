// Modules
const express = require('express');
const passport = require('passport');
const auth = require('../../utils/auth');
let router = express.Router();

router.get('/', auth.checkIfAuthenticated, (req, res) => {
    res.sendStatus(200);
});

router.post('/', passport.authenticate('local'), (req, res) => {
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;
