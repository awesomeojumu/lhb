const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or SMTP config
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `LHB App <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
