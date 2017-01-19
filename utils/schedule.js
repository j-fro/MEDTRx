var pg = require('pg');
var schedule = require('node-schedule');
var db = require('../utils/dbUtils');

function getReminderById(userId, callback) {
    db.connect(function(client, end) {
        client.query('SELECT * FROM reminders WHERE user_id=$1', [userId], function(err, result) {
            end();
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows[0]);
            }
        });
    });
}

function getAllReminderTimes(callback) {
    db.connect(function(client, end) {
        client.query('SELECT * FROM reminders', function(err, result) {
            end();
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    });
}

var scheduleReminder = function(userId) {
    getReminderById(userId, function(err, reminder) {
        if (reminder) {
            var today = new Date();
            var reminderDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1,
                reminder.reminder_time.slice(0, 2),
                reminder.reminder_time.slice(3, 5)
            );
            console.log('Scheduling for', reminder.user_id, 'at', reminderDate);
            schedule.scheduleJob(reminderDate, function() {
                console.log('Sending a reminder for', userId);
                scheduleReminder(userId);
            });
        }
    });
};

module.exports = scheduleReminder;
