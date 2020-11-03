const nodemailer = require("nodemailer");




const transporter = nodemailer.createTransport({
    pool: true,
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD 
    }
});

transporter.sendMail = transporter.sendMail.bind(transporter);

const sendMail = transporter.sendMail

module.exports = {sendMail};




