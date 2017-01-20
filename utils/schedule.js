var pg = require('pg');
var schedule = require('node-schedule');
var db = require('../utils/database/db');
var twilio = require('./twilioClient');



var scheduleReminder = function(userId) {
    db.reminders.select.oneByUserId(userId, function(err, reminder) {
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
                        db.findUserContactsByType(userId, 'phone', function(result) {
                            result.forEach(function(contact) {
                                twilio.sendSms(contact.contact, 'Hey look Im a text messsage');
                            });
                        });
                    }
                });
                scheduleReminder(userId);
            });
        }
    });
};

module.exports = scheduleReminder;
