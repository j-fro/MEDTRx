// Modules
var express = require('express');
var path = require('path');
var pg = require('pg');
var encrypt = require('../../utils/auth').encrypt;
var connString = require('../../utils/dbUtils');
var router = express.Router();

// router.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, '../../public/views/register.html'));
// });

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
    pg.connect(connString)
    .then(function(client) {
        client.query('INSERT INTO users (email, password) VALUES ($1, $2)',
            [username, hash])
        .then(function(result) {
            callback(null, result);
        })
        .catch(function(error) {
            callback(error);
        });
    })
    .catch(function(error) {
        callback(error);
    });
}

module.exports = router;
