const nodemailer = require('nodemailer');
require('dotenv').config();

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
};

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