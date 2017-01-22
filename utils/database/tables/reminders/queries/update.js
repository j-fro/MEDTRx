const connect = require('../../../connect').connect;

function timeByUserId(reminderId, newTime, callback) {
    console.log('Updating a reminder', reminderId, newTime);
    connect((client, end) => {
        let query = `
        UPDATE reminders SET reminder_time=$1 WHERE id=$2
        `;
        client.query(query, [newTime, reminderId], (err) => {
            end();
            callback(err);
        });
    });
}

module.exports = {
    timeByUserId: timeByUserId
};
