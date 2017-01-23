const connect = require('../../../connect').connect;

function one(deviceId, userId) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            INSERT INTO devices (device_id, user_id)
            VALUES ($1, $2)
            `;
            client.query(query, [deviceId, userId], (err) => {
                end();
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

module.exports = {
    one: one
};
