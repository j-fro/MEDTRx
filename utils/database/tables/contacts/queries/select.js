/*
db.contacts.select

.allByUserIdAndType: (userId: integer, contactType: string)
    -> Promise(resolve(result: array[{contact: string}]), reject(err: string))
    Finds all contact numbers for the supplied user that match the supplied type
    and resolves them as an array of objects with property contact. Rejects with
    an error string if an error is encountered.

.allByUser: (userId: integer) -> Promise(resolve(result: array[{
        id: integer,
        user_id: integer,
        contact_type: string,
        contact: string
    }]), reject(err: string))
    Finds all contact numbers for the supplied user and resolves them as an
    array of contact objects. Rejects with an error string if an error is
    encountered.
*/

const connect = require('../../../connect').connect;

function allByUserIdAndType(userId, contactType) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            SELECT contact FROM contacts
            WHERE user_id=$1 AND contact_type=$2
            `;
            client.query(query, [userId, contactType], (err, result) => {
                end();
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    });
}

function allByUser(userId) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            var query = `
            SELECT * FROM contacts
            WHERE user_id=$1
            `;
            client.query(query, [userId], (err, result) => {
                end();
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });
    });
}

module.exports = {
    allByUserIdAndType: allByUserIdAndType,
    allByUser: allByUser
};
