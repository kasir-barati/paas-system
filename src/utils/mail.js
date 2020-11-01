const nodemailer = require('nodemailer');

// const _transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     secure: false,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS
//     }
// });

const _transporter = nodemailer.createTransport({
    secure: false,
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

/**
 * send email
 * @param {string} from admin email
 * @param {string} to user email
 * @param {string} subject mail subject
 * @param {string} html mail content
 * @return {Promise<string>} info
 */
module.exports.sendMail = (from, to, subject, html) => {
    return new Promise((resolve, reject) => {
        _transporter.sendMail({ from, to, subject, html }, (error, info) => {
            if (error) reject(error);
            else resolve(info);
            // info = { messageId, envlope, accepted, rejected, pending, response }
        });
    });
};