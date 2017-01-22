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
