const connect = require('../../../connect').connect;

function byUsernameAndHash(username, hash, callback) {
    connect((client, end) => {
        let query = `
        INSERT INTO users (email, password) VALUES ($1, $2)
        `;
        if (client) {
            client.query(query, [username, hash], (err, result) => {
                end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        }
    });
}

module.exports = {
    byUsernameAndHash: byUsernameAndHash
};
