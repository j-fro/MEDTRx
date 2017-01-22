const connect = require('../../../connect').connect;

function byUserEmail(email, callback) {
    connect((client, end) => {
        let query = `
        SELECT * FROM users
        WHERE email=$1
        `;
        client.query(query, [email], (err, result) => {
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

function byUserId(id, callback) {
    connect((client, end) => {
        let query = `
        SELECT * FROM users
        WHERE id=$1 LIMIT 1
        `;
        client.query(query, [id], (err, result) => {
            end();
            if (err) {
                console.log(err);
            } else {
                callback(result.rows[0]);
            }
        });
    });
}

module.exports = {
    byUserEmail: byUserEmail,
    byUserId: byUserId
};
