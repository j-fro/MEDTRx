const connect = require('../../../connect').connect;

function contact(userId, contact, contactType, callback) {
    connect((client, end) => {
        let query = `
        INSERT INTO contacts (user_id, contact, contact_type)
        VALUES ($1, $2, $3)
        `;
        client.query(query, [userId, contact, contactType], (err) => {
            end();
            callback(err);
        });
    });
}

module.exports = {
    contact: contact
};
