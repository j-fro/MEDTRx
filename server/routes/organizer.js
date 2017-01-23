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

router.get('/device', auth.checkIfAuthenticated, function(req, res) {
    findUsersDevice(req.user.id, function(err, result) {
        console.log('error', err);
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send(result);
        }
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
router.post('/:deviceId', function(req, res) {
    console.log('Received post from device:', req.params.deviceId, 'with data', req.body);
    findMostRecentStatusByDeviceId(req.params.deviceId, function(err, existing) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            // If there are no entries for this device or the most recent entry was
            // not today, make a new entry
        } else if (!existing || existing.created.getDate() !== new Date().getDate()) {
            createStatus(req.params.deviceId, req.body.status, function(err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    console.log('Success');
                    res.sendStatus(201);
                }
            });
        } else {
            console.log('No new entry');
            res.sendStatus(200);
        }
    });
});

router.put('/', auth.checkIfAuthenticated, function(req, res) {
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
 * Takes a device ID and a callback function and queries the database. If there
 * were no errors, executes the callback with the most recent entry for that
 * device in the form (null, [entry]) where null indicates that there was no
 * error. The [entry] CAN be undefined if the device ID was not found in the DB.
 * Otherwise, executes the callback with the error
 */
function findMostRecentStatusByDeviceId(deviceId, callback) {
    db2.connect(function(client, end) {
        if (client) {
            client.query('SELECT * FROM statuses WHERE device_name=$1 ORDER BY created DESC LIMIT 1', [deviceId], function(err, result) {
                end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, result.rows[0]);
                }
            });
        }
    });
}

/*
 * Takes an email (user identification) and callback function and queries the
 * database for the current week's statuses. If there were no errors, executes
 * the callback with the week's entries for the user in the form (null, [entries])
 * where null indicates that there was no error. The [entries] CAN be undefined
 * if the user has no statuses in the DB. Otherwise, executes the callback with
 * the error
 */
function findWeeklyStatusesByEmail(email, callback) {
    console.log('Finding weekly statuses');
    var dateToFind = new Date();
    dateToFind.setDate(dateToFind.getDate() - dateToFind.getDay());
    dateToFind.setHours(0);
    dateToFind.setMinutes(0);
    dateToFind.setSeconds(0);
    var query = 'SELECT statuses.* FROM statuses ' +
        'JOIN devices ON statuses.device_name=devices.device_id ' +
        'JOIN users ON devices.user_id=users.id ' +
        'WHERE users.email=$1 AND statuses.created >= $2';
    db2.connect(function(client, end) {
        if (client) {
            client.query(query, [email, dateToFind], function(err, result) {
                end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, result.rows);
                }
            });
        }
    });
}

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
            }
            else if(result.rows.length > 0){
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

function addDeviceToUser(deviceId, userId, callback) {
    db2.connect(function(client, end) {
        if (client) {
            client.query('INSERT INTO devices (device_id, user_id) VALUES ($1, $2)', [deviceId, userId], function(err) {
                callback(err);
            });
        }
    });
}

module.exports = router;
