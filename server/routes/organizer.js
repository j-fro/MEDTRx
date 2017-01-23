const express = require('express');
const pg = require('pg');
var db2 = require('../../utils/dbUtils');
const auth = require('../../utils/auth');
const db = require('../../utils/database/db');
let router = express.Router();

router.get('/earliest', auth.checkIfAuthenticated, (req, res) => {
    db.statuses.select.earliestByUserId(req.user.id)
        .then(result => res.send(result))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.get('/device', auth.checkIfAuthenticated, (req, res) => {
    db.devices.select.oneByUserId(req.user.id)
        .then(device => res.send(device))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

/*
 * API endpoint for the web client to query a user's statuses. Returns a JSON
 * array of statuses for the authenticated user. If the query encounters any
 * error, sends back a 500
 */
router.get('/:weekStartDate?', auth.checkIfAuthenticated, function(req, res) {
    let weekStartDate;
    if (req.params.weekStartDate) {
        weekStartDate = new Date(req.params.weekStartDate);
    } else {
        let today = new Date();
        today.setDate(today.getDate() - today.getDay());
        console.log('Today:', today);
        weekStartDate = today;
    }
    let weekEndDate = new Date(weekStartDate);

    weekEndDate.setDate(weekEndDate.getDate() + 7);
    console.log('Week start date:', weekStartDate);
    db.statuses.select.weeklyByUserId(req.user.id, weekStartDate, weekEndDate)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

/*
 * API endpoint for the device to make new entries. Only one entry per device
 * per day should be created. On a POST request, make a new status entry in the
 * DB if one of these conditions are true:
 * 1) there have been no entries for the sending device (determined by the devices key in
 *    the request URL)
 * 2) the most recent entry for the sending device was not on the current day
 */
router.post('/:deviceId', (req, res) => {
    console.log('Received post from device:', req.params.deviceId, 'with data', req.body);
    db.statuses.select.mostRecentByDeviceId(req.params.deviceId, (err, existing) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            // If there are no entries for this device or the most recent entry was
            // not today, make a new entry
        } else if (!existing || existing.created.getDate() !== new Date().getDate()) {
            db.statuses.insert.status(req.params.deviceId, req.body.status, (err) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        } else {
            console.log('No new entry');
            res.sendStatus(200);
        }
    });
});

router.put('/', auth.checkIfAuthenticated, (req, res) => {
    console.log('Received put with:', req.body);
    console.log('From:', req.user);
    addDeviceToUser(req.body.deviceId, req.user.id, function(err) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

/*
 * Finds a device for the supplied userId. If a device is found, executes the
 * callback with the device's ID in the form (null, deviceId). If an error
 * occurred, executes the callback with the error [(callback(error))]
 */
function findUsersDevice(userId, callback) {
    db2.connect(function(client, end) {
        client.query('SELECT device_id FROM devices WHERE user_id=$1 LIMIT 1', [userId], function(err, result) {
            end();
            console.log(result.rows);
            if (err) {
                callback(err);
            } else if (result.rows.length > 0) {
                callback(err, result.rows[0]);
            } else {
                callback('No device found');
            }
        });
    });
}

function createStatus(deviceId, status, callback) {
    db2.connect(function(client, end) {
        if (client) {
            client.query('INSERT INTO statuses (device_name, status) VALUES ($1, $2)', [deviceId, status], function(err) {
                end();
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
            });
        }
    });
}

module.exports = router;
