const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

let from_email = new helper.Email("MEDTRx@MEDTRx.com");
let to_email = new helper.Email("jacob.h.froman@gmail.com");
let subject = "Sending with SendGrid is Fun";
let content = new helper.Content("text/plain", "and easy to do anywhere, even with Node.js");
let mail = new helper.Mail(from_email, subject, to_email, content);

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
