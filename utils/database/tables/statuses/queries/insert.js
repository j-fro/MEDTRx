const connect = require('../../../connect').connect;

function status(deviceName, status, callback) {
    connect((client, end) => {
        let query = `
        INSERT INTO statuses (device_name, status)
        VALUES ($1, $2)
        `;
        client.query(query, [deviceName, status], (err) => {
            end();
            callback(err);
        });
    });
}

function createStatus(deviceId, status, callback) {
    db2.connect(function(client, end) {
        if (client) {
            client.query('INSERT INTO statuses (device_name, status) VALUES ($1, $2)', [deviceId, status], function(err) {
                end();
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
            });
        }
    });
}

module.exports = {
    status: status
};
