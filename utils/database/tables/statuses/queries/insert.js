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

module.exports = {
    status: status
};
