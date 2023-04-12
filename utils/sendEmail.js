const createTransport = require("nodemailer").createTransport;

const sendEmail = async (to, subject, text) => {
    const Tranpsorter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
    });

    await Tranpsorter.sendMail({
        to, subject, text
    })
}

module.exports = sendEmail;