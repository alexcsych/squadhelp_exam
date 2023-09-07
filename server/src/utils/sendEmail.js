const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'examsquadhelp@gmail.com',
        pass: 'yhttlpygxlhdolip',
      },
    });

    const mailOptions = {
      from: 'examsquadhelp@gmail.com',
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
