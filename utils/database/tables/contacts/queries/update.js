const connect = require('../../../connect').connect;

function contact(contactId, contact, callback) {
    connect((client, end) => {
        let query = `
        UPDATE contacts
        SET contact=$1
        WHERE id=$2
        `;
        client.query(query, [contact, contactId], (err) => {
            end();
            callback(err);
        });
    });
}

module.exports = {
    contact: contact
};
