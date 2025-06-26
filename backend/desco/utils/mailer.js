// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
   auth: {
    user: process.env.MY_EMAIL, // your email address
    pass: process.env.NOTIFY_EMAIL_PASS, // your email password or app password
   },
  });

const sendServiceDownEmail = async (serviceName, url) => {
  const mailOptions = {
    from: `"Paybill Notifier" <${process.env.MY_EMAIL}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `🚨 Service ${serviceName} is DOWN`,
    text: `Service ${serviceName} (${url}) failed during payment attempt.\n\n`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Notification sent for ${serviceName}`);
  } catch (err) {
    console.error("Failed to send service down email:", err.message);
  }
};

module.exports = { sendServiceDownEmail };
