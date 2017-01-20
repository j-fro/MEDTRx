var pg = require('pg');

var connString = process.env.DATABASE_URL || 'postgres://localhost:5432/medSched';

function connect(callback) {
    pg.connect(connString, function(err, client, end) {
        if (err) {
            console.log(err);
        } else {
            callback(client, end);
        }
    });
}

module.exports = {
    connect: connect
};
