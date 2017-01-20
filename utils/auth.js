var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var publicApi = {
    encrypt: function(password, callback) {
        bcrypt.hash(password, SALT_WORK_FACTOR)
            .then(function(hashedPassword) {
                callback(null, hashedPassword);
            })
            .catch(function(error) {
                callback(error);
            });
    },
    compare: function(candidatePassword, hash, callback) {
        console.log('Cand:', candidatePassword);
        console.log('Hash:', hash);
        bcrypt.compare(candidatePassword, hash)
            .then(function(isMatch) {
                callback(null, isMatch);
            })
            .catch(function(error) {
                callback(error);
            });
    },
    checkIfAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
};

module.exports = publicApi;
