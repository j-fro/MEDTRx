/*
db.contacts.insert

.contact: (userId: integer, contact: string, contactType: string)
    -> Promise(resolve(), reject(err))
    Adds a contact to the database for the supplied user with the supplied info.
    Resolves with no arguments if successful, or rejects with an (err) string if
    an error occurred.
*/

const connect = require('../../../connect').connect;

function contact(userId, contact, contactType, callback) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            INSERT INTO contacts (user_id, contact, contact_type)
            VALUES ($1, $2, $3)
            `;
            client.query(query, [userId, contact, contactType], (err) => {
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
    contact: contact
};
