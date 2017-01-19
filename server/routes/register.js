// Modules
var express = require('express');
var path = require('path');
var pg = require('pg');
var encrypt = require('../../utils/auth').encrypt;
var db = require('../../utils/dbUtils');
var router = express.Router();

router.post('/', function(req, res) {
    console.log('Hit post route:', req.body);
    encrypt(req.body.password, function(err, hash) {
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            createUser(req.body.email, hash, function(err, result) {
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

function createUser(username, hash, callback) {
    db.connect(function(client, end) {
        if (client) {
            client.query('INSERT INTO users (email, password) VALUES ($1, $2)', [username, hash], function(err, result) {
                end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        }
    });
}

module.exports = router;
