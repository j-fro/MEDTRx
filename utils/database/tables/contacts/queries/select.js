const connect = require('../../../connect').connect;

function oneByUserIdAndType(userId, contactType, callback) {
    connect(function(client, end) {
        var query = `
        SELECT contact FROM contacts
        WHERE user_id=$1 AND contact_type=$2
        `;
        client.query(query, [userId, contactType], function(err, result) {
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
    connect(function(client, end) {
        var query = `
        SELECT contact, contact_type FROM contacts
        WHERE user_id=$1
        `;
        client.query(query, [userId], function(err, result) {
            end();
            if (err) {
                console.log(err);
            } else {
                // console.log('Contact result', result.rows);
                callback(result.rows);
            }
        });
    });
}

module.exports = {
    oneByUserIdAndType: oneByUserIdAndType,
    allByUser: allByUser
};
