const connect = require('../../../connect').connect;

function mostRecentByUserId(userId, callback) {
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

module.exports = {
    mostRecentByUserId: mostRecentByUserId
};
