/*jshint esversion: 6 */

var pg = require('pg');

var connString = process.env.DATABASE_URL || 'postgres://localhost:5432/medSched';

function connect(callback) {
    pg.connect(connString, function(err, client, end) {
        if (err) {
            console.log(err);
        } else {
            callback(client, end);
        }
    });
}

function findUsersLastStatus(userId, callback) {
    connect(function(client, end) {
        var query = `
        SELECT created FROM statuses
        JOIN devices ON statuses.device_name=devices.device_id
        WHERE devices.user_id=$1
        ORDER BY created DESC LIMIT 1
        `;
        client.query(query, [userId], function(err, result) {
            end();
            if (err) {
                console.log(err);
            } else {
                console.log('Result', result.rows);
                callback(result.rows[0]);
            }
        });
    });
}

function findUserContacts(userId, callback) {
    connect(function(client, end) {
        var query = `
        SELECT contact, contact_type FROM contacts
        WHERE user_id=$1
        `;
        client.query(query, [userId], function(err, result) {
            end();
            if (err) {
                console.log(err);
            } else {
                console.log('Result', result.rows);
                callback(result.rows);
            }
        });
    });
}

function findUserContactsByType(userId, contactType, callback) {
    connect(function(client, end) {
        var query = `
        SELECT contact FROM contacts
        WHERE user_id=$1 AND contact_type=$2
        `;
        client.query(query, [userId, contactType], function(err, result) {
            end();
            if (err) {
                console.log(err);
            } else {
                console.log('Result', result.rows);
                callback(result.rows);
            }
        });
    });
}

// Pulled
// function updateReminderTime(reminderId, newTime, callback) {
//     console.log('Updating a reminder', reminderId, newTime);
//     connect(function(client, end) {
//         let query = `
//         UPDATE reminders SET reminder_time=$1 WHERE id=$2
//         `;
//         client.query(query, [newTime, reminderId], function(err) {
//             end();
//             callback(err);
//         });
//     });
// }
//
// function addNewReminderTime(userId, reminderTime, callback) {
//     console.log('Adding a new time for', userId, 'at', reminderTime);
//     connect(function(client, end) {
//         let query = `
//         INSERT INTO reminders (user_id, reminder_time) VALUES ($1, $2)
//         `;
//         client.query(query, [userId, reminderTime], function(err) {
//             end();
//             callback(err);
//         });
//     });
// }
//
// function findTimeByUserId(userId, callback) {
//     console.log('Finding a time for', userId);
//     connect(function(client, end) {
//         var query = `
//             SELECT id, reminder_time FROM reminders
//             WHERE user_id=$1
//         `;
//         client.query(query, [userId], function(err, result) {
//             end();
//             if (err) {
//                 console.log(err);
//                 callback(err);
//             } else {
//                 console.log('Got a result:', result.rows);
//                 if (result.rows.length > 0) {
//                     callback(null, result.rows[0]);
//                 } else {
//                     callback(null, null);
//                 }
//             }
//         });
//     });
// }
//
// function getReminderById(userId, callback) {
//     connect(function(client, end) {
//         client.query('SELECT * FROM reminders WHERE user_id=$1', [userId], function(err, result) {
//             end();
//             if (err) {
//                 callback(err);
//             } else {
//                 callback(null, result.rows[0]);
//             }
//         });
//     });
// }
//
// function getAllReminderTimes(callback) {
//     connect(function(client, end) {
//         client.query('SELECT * FROM reminders', function(err, result) {
//             end();
//             if (err) {
//                 callback(err);
//             } else {
//                 callback(null, result.rows);
//             }
//         });
//     });
// }

module.exports = {
    connect: connect,
    connString: connString,
    findUsersLastStatus: findUsersLastStatus,
    findUserContacts: findUserContacts,
    findUserContactsByType: findUserContactsByType
};
