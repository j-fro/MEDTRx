const connect = require('../../../connect').connect;

function oneByUserId(userId) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            SELECT device_id FROM devices
            WHERE user_id=$1 LIMIT 1
            `;
            client.query(query, [userId], (err, result) => {
                end();
                if (err) {
                    reject(err);
                } else if (result.rows.length > 0) {
                    resolve(result.rows[0]);
                } else {
                    reject('No device found');
                }
            });
        });
    });
}

module.exports = {oneByUserId: oneByUserId};
