const nodemailer = require("nodemailer");




const transporter = nodemailer.createTransport({
/*    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password */
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD 
    }
});

transporter.sendMail = transporter.sendMail.bind(transporter);

const sendMail = transporter.sendMail

module.exports = {sendMail};




