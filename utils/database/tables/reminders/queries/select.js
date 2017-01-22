const connect = require('../../../connect').connect;

function oneByUserId(userId, callback) {
    console.log('Finding a time for', userId);
    connect(function(client, end) {
        var query = `
            SELECT * FROM reminders
            WHERE user_id=$1
        `;
        client.query(query, [userId], function(err, result) {
            end();
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log('Got a result:', result.rows);
                if (result.rows.length > 0) {
                    callback(null, result.rows[0]);
                } else {
                    callback(null, null);
                }
            }
        });
    });
}

function all(callback) {
    connect(function(client, end) {
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

module.exports = {
    all: all,
    oneByUserId: oneByUserId
};
