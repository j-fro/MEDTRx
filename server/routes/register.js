// Modules
var express = require('express');
var path = require('path');
var pg = require('pg');
var encrypt = require('../../utils/auth').encrypt;
var db = require('../../utils/database/db');
var router = express.Router();

router.post('/', function(req, res) {
    console.log('Hit post route:', req.body);
    encrypt(req.body.password, function(err, hash) {
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            db.users.insert.byUsernameAndHash(req.body.email, hash, function(err, result) {
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    console.log('Success');
                    res.sendStatus(201);
                }
            });
        }
    });
});

module.exports = router;
