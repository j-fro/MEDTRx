const connect = require('../../../connect').connect;

function mostRecentByUserId(userId, callback) {
    connect((client, end) => {
        let query = `
        SELECT created FROM statuses
        JOIN devices ON statuses.device_name=devices.device_id
        WHERE devices.user_id=$1
        ORDER BY created DESC LIMIT 1
        `;
        client.query(query, [userId], (err, result) => {
            end();
            if (err) {
                console.log(err);
            } else {
                callback(result.rows[0]);
            }
        });
    });
}

function weeklyByUserId(userId, weekStartDate, weekEndDate) {
    weekStartDate.setHours(0);
    weekStartDate.setMinutes(0);
    console.log('Week start date:', weekStartDate);
    console.log('Week end date:', weekEndDate);
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            SELECT statuses.* FROM statuses
            JOIN devices ON statuses.device_name=devices.device_id
            WHERE devices.user_id=$1
            AND statuses.created>=$2
            AND statuses.created<=$3
            `;
            client.query(query, [userId, weekStartDate, weekEndDate], (err, result) => {
                end();
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    });
}

function earliestByUserId(userId) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            SELECT created FROM statuses
            JOIN devices ON statuses.device_name=devices.device_id
            WHERE devices.user_id=$1
            ORDER BY created ASC LIMIT 1
            `;
            client.query(query, [userId], (err, result) => {
                end();
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows[0]);
                }
            });
        });
    });
}

function mostRecentByDeviceId(deviceId, callback) {
    connect((client, end) => {
        let query = `
        SELECT * FROM statuses
        WHERE device_name=$1
        ORDER BY created DESC LIMIT 1
        `;
        client.query(query, [deviceId], (err, result) => {
            end();
            callback(err, result.rows[0]);
        });
    });
}

module.exports = {
    mostRecentByUserId: mostRecentByUserId,
    weeklyByUserId: weeklyByUserId,
    earliestByUserId: earliestByUserId,
    mostRecentByDeviceId: mostRecentByDeviceId
};
