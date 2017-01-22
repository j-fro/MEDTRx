const connect = require('../../../connect').connect;

function byUserId(userId, reminderTime, callback) {
    console.log('Adding a new time for', userId, 'at', reminderTime);
    connect((client, end) => {
        let query = `
        INSERT INTO reminders (user_id, reminder_time) VALUES ($1, $2)
        `;
        client.query(query, [userId, reminderTime], (err) => {
            end();
            callback(err);
        });
    });
}

module.exports = {
    byUserId: byUserId
};
