const connect = require('../../../connect').connect;

function oneByUserId(userId, callback) {
    console.log('Finding a time for', userId);
    connect((client, end) => {
        let query = `
            SELECT * FROM reminders
            WHERE user_id=$1
        `;
        client.query(query, [userId], (err, result) => {
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

function all() {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            client.query('SELECT * FROM reminders', (err, result) => {
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

module.exports = {
    all: all,
    oneByUserId: oneByUserId
};
