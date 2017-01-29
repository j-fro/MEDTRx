const schedule = require('node-schedule');
const sendEmail = require('../utils/sendGridClient').sendEmail;
const knex = require('./database');
const twilio = require('./twilioClient');
const DAY_IN_MS = 86400000;

function scheduleReminder(userId) {
    knex.select().from('reminders').where('user_id', userId).then(reminders => {
        let reminder = reminders[0];
        let reminderDate = buildReminderDate(reminders.reminder_time);
        console.log('Scheduling for', reminder.user_id, 'at', reminderDate);
        addToSchedule(userId, reminderDate);
    });
}

function scheduleAllReminders() {
    knex
        .select()
        .from('reminders')
        .then(reminders => {
            reminders.forEach(reminder => {
                console.log(
                    'Scheduling a reminider for',
                    reminder.user_id,
                    'at',
                    reminder.reminder_time
                );
                let reminderDate = buildReminderDate(reminder.reminder_time);
                addToSchedule(reminder.user_id, reminderDate);
            });
        })
        .catch(err => console.log(err));
}

function addToSchedule(userId, reminderDate) {
    console.log('In addToSchedule');
    schedule.scheduleJob(reminderDate, function() {
        console.log('In addToSchedule: scheduling a job at:', reminderDate);
        knex
            .select()
            .from('statuses')
            .where('user_id', userId)
            .orderBy('created', 'desc')
            .limit(1)
            .then(statuses => {
                let status = statuses[0];
                console.log('In addToSchedule: found a status:', status);
                if (status) {
                    status.created = new Date(status.created);
                    console.log(
                        'In addToSchedule: status time is now:',
                        status.created.getHours() +
                            ':' +
                            status.created.getMinutes()
                    );
                }
                if (
                    !status ||
                        new Date().getTime() - status.created.getTime() >=
                            DAY_IN_MS
                ) {
                    console.log(
                        'In addToSchedule: sending a reminder for',
                        userId
                    );
                    sendSmsReminder(userId).catch(err => console.log(err));
                    sendEmailReminder(userId).catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
        scheduleReminder(userId);
    });
}

module.exports = {
    scheduleReminder: scheduleReminder,
    scheduleAllReminders: scheduleAllReminders
};

function buildReminderDate(reminderTime) {
    let today = new Date();
    let reminderDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        reminderTime.slice(0, 2),
        reminderTime.slice(3, 5),
        today.getSeconds() + 60
    );
    // reminderDate.setDate(today.getDate() + 1);
    return reminderDate;
}

function sendSmsReminder(userId) {
    return new Promise((resolve, reject) => {
        knex
            .select()
            .from('contacts')
            .where('user_id', userId)
            .andWhere('contact_type', 'phone')
            .then(contacts => {
                console.log('Contacts:', contacts);
                contacts.forEach(function(contact) {
                    twilio.sendSms(
                        contact.contact,
                        'You missed your check-in today'
                    );
                });
                resolve();
            })
            .catch(err => reject(err));
    });
}

function sendEmailReminder(userId) {
    return new Promise((resolve, reject) => {
        knex
            .select()
            .from('contacts')
            .where('user_id', userId)
            .andWhere('contact_type', 'email')
            .then(contacts => {
                console.log('In addToSchedule: email contacts:', contacts);
                let message = {
                    type: 'text/plain',
                    value: 'You missed your medication check-in today'
                };
                contacts.forEach(contact => {
                    sendEmail(
                        {email: contact.contact},
                        'You missed your check-in',
                        message
                    ).catch(err => console.log(err.response.body.errors));
                });
                resolve();
            })
            .catch(err => reject(err));
    });
}
