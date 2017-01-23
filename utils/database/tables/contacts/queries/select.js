const connect = require('../../../connect').connect;

function oneByUserIdAndType(userId, contactType, callback) {
    connect((client, end) => {
        let query = `
        SELECT contact FROM contacts
        WHERE user_id=$1 AND contact_type=$2
        `;
        client.query(query, [userId, contactType], (err, result) => {
            end();
            if (err) {
                console.log(err);
            } else {
                console.log('Result', result.rows);
                callback(result.rows);
            }
        });
    });
}

function allByUser(userId, callback) {
    connect((client, end) => {
        var query = `
        SELECT * FROM contacts
        WHERE user_id=$1
        `;
        client.query(query, [userId], (err, result) => {
            end();
            if (err) {
                console.log(err);
            } else {
                callback(result.rows);
            }
        });
    });
}

module.exports = {
    oneByUserIdAndType: oneByUserIdAndType,
    allByUser: allByUser
};
