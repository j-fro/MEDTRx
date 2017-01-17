var connString = process.env.DATABASE_URL || 'postgres://localhost:5432/medSched';

module.exports = connString;
