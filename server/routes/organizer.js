var express = require('express');
var pg = require('pg');
var router = express.Router();

var connString = process.env.DATABASE_URL || 'postgres://localhost:5432/medSched';

router.get('/', function(req, res) {
    res.send('Here waiting for the organizer..');
});

router.post('/:deviceId', function(req, res) {
    console.log('Received post from device:', req.params.deviceId, 'with data', req.body);
    findMostRecentStatusByDeviceId(req.params.deviceId, function(err, existing) {
        if (err) {
            console.log(err);
        } else if (!existing || existing.created.getDate() !== new Date().getDate()) {
            console.log('existing', existing);
            console.log('existing date', existing.created.getDate());
            console.log('current date', new Date().getDate());
            console.log('Creating a new entry');
            createStatus(req.params.deviceId, req.body.status, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Success');
                }
            });
        } else {
            console.log('No new entry');
        }
    });
    res.sendStatus(501);
});

router.put('/', function(req, res) {
    console.log('Received put with:', req.body);
    res.sendStatus(501);
});

function findMostRecentStatusByDeviceId(deviceId, callback) {
    pg.connect(connString)
        .then(function(client, done) {
            client.query('SELECT * FROM statuses WHERE device_name=$1 ORDER BY created DESC LIMIT 1', [deviceId])
                .then(function(result) {
                    callback(null, result.rows[0]);
                })
                .catch(function(err) {
                    callback(err);
                });
        })
        .catch(function(err) {
            console.log('Error', err);
        });
}

function createStatus(deviceId, status, callback) {
    pg.connect(connString)
        .then(function(client, done) {
            client.query('INSERT INTO statuses (device_name, status) VALUES ($1, $2)',
                [deviceId, status])
                .then(function() {
                    callback();
                })
                .catch(function(err) {
                    callback(err);
                });
        });
}

module.exports = router;
