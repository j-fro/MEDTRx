var express = require('express');
var pg = require('pg');
var router = express.Router();

var connString = process.env.DATABASE_URL || 'postgres://localhost:5432/medSched';

router.get('/', function(req, res) {
    res.send('Here waiting for the organizer..');
});

/*
 * API endpoint for the device to make new entries. Only one entry per device
 * per day should be created. On a POST request, make a new status entry in the
 * DB if one of these conditions are true:
 * 1) there have been no entries for the sending device (determined by the devices key in
 *    the request URL)
 * 2) the most recent entry for the sending device was not on the current day
 */
router.post('/:deviceId', function(req, res) {
    console.log('Received post from device:', req.params.deviceId, 'with data', req.body);
    findMostRecentStatusByDeviceId(req.params.deviceId, function(err, existing) {
        if (err) {
            console.log(err);
        // If there are no entries for this device or the most recent entry was
        // not today, make a new entry
        } else if (!existing || existing.created.getDate() !== new Date().getDate()) {
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

/*
 * Takes a device ID and a callback function and queries the database. If there
 * were no errors, executes the callback with the most recent entry for that
 * device in the form (null, [entry]) where null indicates that there was no
 * error. The [entry] CAN be undefined if the device ID was not found in the DB.
 * Otherwise, executes the callback with the error
 */
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
