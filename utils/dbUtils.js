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
            if (err) {
                console.log(err);
            } else {
                console.log('Result', result.rows);
                callback(result.rows[0]);
            }
        });
    });
}

module.exports = {
    connect: connect,
    connString: connString,
    findUsersLastStatus: findUsersLastStatus
};
