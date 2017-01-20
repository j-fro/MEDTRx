var pg = require('pg');
var schedule = require('node-schedule');
var db = require('../utils/dbUtils');
var twilio = require('./twilioClient');

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
                today.getDate(),
                reminder.reminder_time.slice(0, 2),
                reminder.reminder_time.slice(3, 5),
                today.getSeconds() + 10
            );
            console.log('Scheduling for', reminder.user_id, 'at', reminderDate);
            schedule.scheduleJob(reminderDate, function() {
                db.findUsersLastStatus(userId, function(status) {
                    console.log('Found a status:', status);
                    if (status) {
                        status.created = new Date(status.created);
                        status.created = status.created.setHours(status.created.getHours() + 12);
                    }
                    if (!status || new Date(status.created).getDate() === today.getDate()) {
                        console.log('Sending a reminder for', userId);
                        twilio.sendSms('+14152790865', 'Hey look Im a text messsage');
                    }
                });
                scheduleReminder(userId);
            });
        }
    });
};

module.exports = scheduleReminder;
