const connect = require('../../../connect').connect;

function byUsernameAndHash(username, hash, callback) {
    connect(function(client, end) {
        var query = `
        INSERT INTO users (email, password) VALUES ($1, $2)
        `;
        if (client) {
            client.query(query, [username, hash], function(err, result) {
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
