/*
db.contacts.delete

.one: (contactId: integer) -> Promise(resolve(), reject(err: string))
    Deletes any contact records from the database if their id matches
    (contactId). Resolves with no arguments if successful, or rejects with an
    (err) string if an error occurred.
*/

const connect = require('../../../connect').connect;

function one(contactId) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            DELETE FROM contacts
            WHERE id=$1
            `;
            client.query(query, [contactId], (err) => {
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
    one: one
};
