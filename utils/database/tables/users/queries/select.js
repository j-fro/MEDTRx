const connect = require('../../../connect').connect;

function byUserEmail(email, callback) {
    connect(function(client, end) {
        var query = `
        SELECT * FROM users
        WHERE email=$1
        `;
        client.query(query, [email], function(err, result) {
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
    byUserId: byUserEmail
};
