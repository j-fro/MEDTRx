const pg = require('pg');
const schedule = require('node-schedule');
const db = require('../utils/database/db');
const twilio = require('./twilioClient');

function scheduleReminder(userId) {
    db.reminders.select.oneByUserId(userId, function(err, reminder) {
        if (reminder) {
            let reminderDate = buildReminderDate(reminder.reminder_time);
            console.log('Scheduling for', reminder.user_id, 'at', reminderDate);
            addToSchedule(userId, reminderDate);
        }
    });
}

function scheduleAllReminders() {
    db.reminders.select.all()
        .then((reminders) => {
            reminders.forEach((reminder) => {
                console.log('Scheduling a reminider for', reminder.user_id, 'at', reminder.reminder_time);
                let reminderDate = buildReminderDate(reminder.reminder_time);
                addToSchedule(reminder.user_id, reminderDate);
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

function addToSchedule(userId, reminderDate) {
    schedule.scheduleJob(reminderDate, function() {
        db.statuses.select.mostRecentByUserId(userId, function(status) {
            console.log('Found a status:', status);
            if (status) {
                status.created = new Date(status.created);
                status.created = status.created.setHours(status.created.getHours() + 12);
            }
            if (!status || new Date(status.created).getDate() === today.getDate()) {
                console.log('Sending a reminder for', userId);
                db.contacts.select.allByUserIdAndType(userId, 'phone')
                    .then((contacts) => {
                        result.forEach(function(contact) {
                            twilio.sendSms(contact.contact, 'Hey look Im a text messsage');
                        });
                    })
                    .catch(err => console.log(err));
            }
        });
        scheduleReminder(userId);
    });
}

function buildReminderDate(reminderTime) {
    let today = new Date();
    let reminderDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        reminderTime.slice(0, 2),
        reminderTime.slice(3, 5),
        today.getSeconds() + 10
    );
    return reminderDate;
}

module.exports = {
    scheduleReminder: scheduleReminder,
    scheduleAllReminders: scheduleAllReminders
};
