const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'testuser21@example.com',
    pass: 'wxbf jlgy shra tlao',
  },
});

transporter.sendMail({
  from: '"Test" <testuser21@example.com>',
  to: 'testuser21@example.com',
  subject: 'Test Email',
  text: 'This is a test email.',
}, (err, info) => {
  if (err) return console.error('Error:', err);
  console.log('Email sent:', info);
});
