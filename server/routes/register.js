// Modules
const express = require('express');
const encrypt = require('../../utils/auth').encrypt;
const knex = require('../../utils/database');
let router = express.Router();

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
        }
    });
});

module.exports = router;

function createUserDevice(userEmail, deviceId) {
    return new Promise((resolve, reject) => {
        if (deviceId) {
            knex
                .select('id')
                .from('users')
                .where('email', userEmail)
                .then(user => {
                    if (user[0]) {
                        knex
                            .insert({user_id: user[0].id, device_id: deviceId})
                            .into('devices')
                            .then(() => resolve())
                            .catch(err => reject(err));
                    }
                });
        } else {
            resolve('No device Id present');
        }
    });
}
