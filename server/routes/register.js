// Modules
var express = require('express');
var path = require('path');
var pg = require('pg');
var encrypt = require('../../utils/auth').encrypt;
var db = require('../../utils/database/db');
const knex = require('../../utils/database');
var router = express.Router();

router.post('/', function(req, res) {
    console.log('Hit post route:', req.body);
    encrypt(req.body.password, (err, hash) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            knex
                .insert({email: req.body.email, password: hash})
                .into('users')
                .then(() => {
                    createUserDevice(req.body.email, req.body.deviceId)
                        .then(() => res.sendStatus(201))
                        .catch(err => {
                            console.log(err);
                            res.sendStatus(500);
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.sendStatus(500);
                });
            // db.users.insert.byUsernameAndHash(req.body.email, hash, function(
            //     err,
            //     result
            // ) {
            //     if (err) {
            //         console.log(err);
            //         res.sendStatus(500);
            //     } else {
            //         createUserDevice(req.body.email, req.body.deviceId)
            //             .then(message => {
            //                 console.log(message);
            //                 res.sendStatus(201);
            //             })
            //             .catch(err => {
            //                 console.log(err);
            //                 res.sendStatus(500);
            //             });
            //     }
            // });
        }
    });
});

module.exports = router;

function createUserDevice(userEmail, deviceId) {
    return new Promise((resolve, reject) => {
        if (deviceId) {
            db.users.select.byUserEmail(userEmail, function(user) {
                if (user) {
                    db.devices.insert
                        .one(deviceId, user.id)
                        .then(() => resolve('Success'))
                        .catch(err => reject(err));
                }
            });
        } else {
            resolve('No device Id present');
        }
    });
}
