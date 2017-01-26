const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

let from_email = new helper.Email('MEDTRx@MEDTRx.com');

module.exports = {
    sendEmail: (toEmail, subject, content) => {
        return new Promise((resolve, reject) => {
            let mail = new helper.Mail(from_email, subject, toEmail, content);
            let request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });
            sg.API(request, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
};
