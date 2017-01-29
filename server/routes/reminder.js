const express = require('express');
const auth = require('../../utils/auth');
const knex = require('../../utils/database');
let router = express.Router();

router.use(auth.checkIfAuthenticated);

router.get('/', (req, res) => {
    knex
        .select()
        .from('reminders')
        .where('user_id', req.user.id)
        .limit(1)
        .then(reminders => res.send(reminders[0]))
        .catch(err => {
            console.log(err);
            res.sendStatus(501);
        });
});

router.put('/', function(req, res) {
    console.log('Updating reminder for', req.user);
    var timeIn = new Date(req.body.reminderTime);
    var reminderTime = timeIn.getHours() +
        ':' +
        timeIn.getMinutes() +
        ':' +
        timeIn.getSeconds();

    knex
        .select()
        .from('reminders')
        .where('user_id', req.user.id)
        .limit(1)
        .then(reminders => {
            if (reminders[0]) {
                updateReminder(reminders[0], reminderTime)
                    .then(() => res.sendStatus(200))
                    .catch(err => {
                        console.log(err);
                        res.sendStatus(501);
                    });
            } else {
                insertReminder(req.user.id, reminderTime)
                    .then(() => res.sendStatus(200))
                    .catch(err => {
                        console.log(err);
                        res.sendStatus(501);
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(501);
        });
});

module.exports = router;

function updateReminder(reminder, reminderTime) {
    return new Promise((resolve, reject) => {
        knex
            .from('reminders')
            .where('id', reminder.id)
            .update('reminder_time', reminderTime)
            .then(() => resolve())
            .catch(err => reject(err));
    });
}

function insertReminder(userId, reminderTime) {
    return new Promise((resolve, reject) => {
        knex
            .insert({user_id: userId, reminder_time: reminderTime})
            .into('reminders')
            .then(() => resolve())
            .catch(err => reject(err));
    });
}
