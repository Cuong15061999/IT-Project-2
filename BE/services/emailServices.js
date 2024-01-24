const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "phamvqcuong99@gmail.com",
        pass: "isgjfkrctmzhpiss",
    },
});

// async..await is not allowed in global scope, must use a wrapper
class sendEmailService {
    async setEmail (listEmail, content, subject) {
        const info = await transporter.sendMail({
            from: 'phamvqcuong99@gmail.com', // sender address
            to: listEmail, // list of receivers
            subject: subject? subject : 'Default subject', // Subject line
            text: "Hello world? cuong test", // plain text body
            html: content, // html body
        });
        return info
    }
}
module.exports = new sendEmailService();
