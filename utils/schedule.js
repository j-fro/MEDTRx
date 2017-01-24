const schedule = require('node-schedule');
const sendEmail = require('../utils/sendGridClient').sendEmail;
const db = require('../utils/database/db');
const twilio = require('./twilioClient');
const DAY_IN_MS = 86400000;

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
    console.log('In addToSchedule');
    schedule.scheduleJob(reminderDate, function() {
        console.log('In addToSchedule: scheduling a job at:', reminderDate);
        db.statuses.select.mostRecentByUserId(userId, function(status) {
            console.log('In addToSchedule: found a status:', status);
            if (status) {
                status.created = new Date(status.created);
                console.log('In addToSchedule: status time is now:', status.created.getHours() + ':' + status.created.getMinutes());
            }
            if (!status ||  new Date().getTime() - status.created.getTime() >= DAY_IN_MS) {
                console.log('In addToSchedule: sending a reminder for', userId);
                db.contacts.select.allByUserIdAndType(userId, 'phone')
                    .then((contacts) => {
                        console.log('Contacts:', contacts);
                        contacts.forEach(function(contact) {
                            twilio.sendSms(contact.contact, 'Hey look Im a text messsage');
                        });
                    })
                    .catch(err => console.log(err));
                db.contacts.select.allByUserIdAndType(userId, 'email')
                    .then((contacts) => {
                        console.log('In addToSchedule: email contacts:', contacts);
                        let message = {
                            type: 'text/plain',
                            value: 'You missed your medication check-in on ' +
                            new Date().getDay()
                        };
                        contacts.forEach((contact) => {
                            sendEmail({email: contact.contact}, 'You missed your check-in', message)
                                .catch((err) => console.log(err.response.body.errors));
                        });
                    });
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
        today.getSeconds()
    );
    reminderDate.setDate(today.getDate() + 1);
    return reminderDate;
}

module.exports = {
    scheduleReminder: scheduleReminder,
    scheduleAllReminders: scheduleAllReminders
};
