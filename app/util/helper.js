// Generate OTP
exports.generateOtp = () => {
    return Math.floor(1_000_000 + Math.random() * 9_000_000);
};