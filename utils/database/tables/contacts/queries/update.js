/*
db.contacts.update

.contact(contactId: integer, contact: string) -> Promise(resolve(), reject(err))
    Updates a contact record from the database if its id matches (contactId)
    and sets the contact value to (contact). Resolves with no arguments if
    successful, or rejects with an (err) string if an error occurred.
*/

const connect = require('../../../connect').connect;

function contact(contactId, contact, callback) {
    return new Promise((resolve, reject) => {
        connect((client, end) => {
            let query = `
            UPDATE contacts
            SET contact=$1
            WHERE id=$2
            `;
            client.query(query, [contact, contactId], (err) => {
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
