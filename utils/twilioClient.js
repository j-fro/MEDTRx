var config = require('./twilioConfig');
var client = require('twilio')(config.accountSid, config.authToken);

module.exports.sendSms = function(to, message) {
    client.messages.create({
        body: message,
        to: to,
        from: config.sendingNumber
    }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success');
        }
    });
};
