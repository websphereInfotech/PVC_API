const nodemailer = require('nodemailer');
require('dotenv').config();

const smtpConfig = {
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectunauthorized: false
    }
};
console.log('smtpConfig: ', smtpConfig);

const transporter = nodemailer.createTransport(smtpConfig);

exports.sendEmail = (to, subject, html) => {
    const mail = {
        to,
        from: process.env.SMTP_EMAIL,
        subject,
        html
    };

    transporter.sendMail(mail);
};