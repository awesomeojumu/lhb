const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, // ✅ TLS recommended
        secure: false, // ✅ false for TLS, true for SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // ✅ Prevent some local SSL errors
        },
    });

    const mailOptions = {
        from: `LHB App <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
