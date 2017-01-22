const pg = require('pg');

const connString = process.env.DATABASE_URL || 'postgres://localhost:5432/medSched';

function connect(callback) {
    pg.connect(connString, (err, client, end) => {
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
