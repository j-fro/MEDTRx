const express = require('express');
const pg = require('pg');
const schedule = require('node-schedule');
const db = require('../../utils/database/db');
const auth = require('../../utils/auth');
let router = express.Router();

router.use(auth.checkIfAuthenticated);

router.get('/', (req, res) => {
    db.reminders.select.oneByUserId(req.user.id, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(501);
        } else {
            res.send(result);
        }
    });
});

router.put('/', function(req, res) {
    console.log('Updating reminder for', req.user);
    var timeIn = new Date(req.body.reminderTime);
    var reminderTime = timeIn.getHours() + ':' + timeIn.getMinutes() + ':' + timeIn.getSeconds();

    db.reminders.select.oneByUserId(req.user.id, function(err, result) {
        if (err) {
            console.log(err);
        } else if (result) {
            console.log(result);
            db.reminders.update.timeByUserId(result.id, reminderTime, function(err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            db.reminders.insert.byUserId(req.user.id, reminderTime, function(err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

module.exports = router;
