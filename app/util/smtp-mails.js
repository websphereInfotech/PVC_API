const path = require('path');
const fs = require('fs');
const { sendEmail } = require('./smtp-service');
const { generateOtp } = require('./helper');

// Send forgot password mail
exports.forgotPasswordMail = (email) => {
    // Generate OTP
    const otp = generateOtp();

    // Prepare html content
    const url = path.join(__dirname, '../content/forget-password.html');
    let html = fs.readFileSync(url, 'utf8');

    html = html.replace("{NEW_PASSWORD}", otp);
    const subject = "Forgot password request";
    
    // Send mail
    sendEmail(email, subject, html);
    return otp;
};